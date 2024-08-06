// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "./Interfaces/IWhitelist.sol";
import "./Interfaces/IEscrow.sol";
import "./Interfaces/IMediationService.sol";
import "./DataStructuresLibrary.sol";

interface IEscrowFactory {
    function createEscrowContract(
        address _marketplace,
        uint256 _projectId,
        address _buyer,
        address _provider,
        address _paymentToken,
        uint256 _projectFee,
        uint256 _providerStake,
        address _mediationService,
        string memory _detailsURI
    ) external returns (address); 
}

contract Marketplace is DataStructuresLibrary {
    using Counters for Counters.Counter;

    address public immutable GOVERNOR;
    IWhitelist public immutable WHITELIST;
    IMediationService public immutable MEDIATION_SERVICE;
    IEscrowFactory public immutable ESCROW_FACTORY;

    /**
     * @notice ERC20 tokens which can be used as payment token for Projects
     */
    address[] public erc20Tokens;
    mapping(address => bool) public isApprovedToken;

    /**
     * @notice transaction fee charged for creating projects in marketplace, represented as a percentage of project fee
     */
    uint256 public nebulaiTxFee = 3; 
    /**
     * @notice expressed as 3 * (10 ** payment token decimals)
     */
    uint256 public constant MINIMUM_TX_FEE = 3;

    /**
     * @dev Transaction fees held for a Project ID (fees will be returned if Project is Cancelled)
     */
    mapping(uint256 => uint256) private txFeesHeld;

    /**
     * @dev token address (address zero for native currency) to amount held by Marketplace (non-refundable)
     */
    mapping(address => uint256) private txFeesPaid;

    /**
     * @dev token address (address zero for native currency) to amount received from completed Projects
     */
    mapping(address => uint256) private commissionFees; 

    Counters.Counter public projectIds; 
    mapping(uint256 => Project) private projects;

    Counters.Counter public changeOrderIds;
    mapping(uint256 => ChangeOrder[]) private changeOrders; // only one active Change Order per Project ID is possible 

    /**
     * @dev Project ID mapped to Dispute ID in MediationService smart contract
     */
    mapping(uint256 => uint256) private mediationCases; 

    /**
     * @notice time to approve a Change Order after it is created
     */
    uint24 public constant CHANGE_ORDER_PERIOD = 7 days; 

    /**
     * @notice time to appeal a MediationService decision after the decision has been rendered
     */
    uint24 public constant APPEAL_PERIOD = 7 days; 

    event NebulaiTxFeeChanged(uint256 txFee);
    event ERC20Approved(address token);
    event ERC20Removed(address token);
    event ProjectCreated(uint256 indexed projectId, address indexed buyer, address indexed provider); 
    event ProjectCancelled(uint256 indexed projectId, address indexed buyer, address indexed provider); 
    event ProjectActivated(uint256 indexed projectId, address indexed buyer, address indexed provider);
    event ProjectDiscontinued(uint256 indexed projectId, address indexed buyer, address indexed provider);
    event ProjectCompleted(uint256 indexed projectId, address indexed buyer, address indexed provider);
    event ProjectApproved(uint256 indexed projectId, address indexed buyer, address indexed provider);
    event ProjectChallenged(uint256 indexed projectId, address indexed buyer, address indexed provider);
    event ProjectDisputed(uint256 indexed projectId, address indexed buyer, address indexed provider, uint256 disputeId);
    event ProjectAppealed(uint256 indexed projectId, uint256 indexed disputeId, address appealedBy);
    event ReviewOverdue(uint256 indexed projectId, address indexed buyer, address indexed provider);
    event ChangeOrderProposed(uint256 indexed projectId);
    event ChangeOrderApproved(uint256 indexed projectId, address indexed buyer, address indexed provider);
    event ChangeOrderRetracted(uint256 indexed projectId, address indexed retractedBy);
    event ResolvedByMediation(uint256 indexed projectId, uint256 indexed disputeId);
    event ResolvedByDismissedCase(uint256 indexed projectId, uint256 indexed disputeId);
    event SettlementProposed(uint256 indexed projectId, uint256 indexed disputeId);
    event CommissionFeeReceived(uint256 indexed projectId, uint256 commissionAmount, address paymentToken);
    event FeesWithdrawnERC20(address recipient, address token, uint256 amount);
    event FeesWithdrawnNative(address recipient, uint256 amount);
    event EscrowWithdrawn(
        uint256 indexed projectId, 
        address indexed user, 
        address indexed escrow,
        uint256 amount, 
        uint256 commissionFeePaid
    );

    // transfers
    error Marketplace__TransferFailed();
    error Marketplace__InsufficientAmount();
    error Marketplace__InsufficientApproval();
    error Marketplace__NativeCurrencySent();
    error Marketplace__EscrowWithdrawError();
    // permissions
    error Marketplace__OnlyUser();
    error Marketplace__OnlyGovernor();
    error Marketplace__OnlyBuyer();
    error Marketplace__OnlyProvider();
    error Marketplace__OnlyBuyerOrProvider();
    error Marketplace__CommissionMustBePaidByEscrow();
    // input data
    error Marketplace__InvalidProviderAddress();
    error Marketplace__InvalidDueDate();
    error Marketplace__UnapprovedToken();
    error Marketplace__InvalidReviewPeriodLength();
    // project actions
    error Marketplace__ProjectCannotBeCancelled();
    error Marketplace__ProjectCannotBeActivated();
    error Marketplace__ProjectMustBeActive();
    error Marketplace__ProjectNotCompleted();
    error Marketplace__ProjectCannotBeChallenged();
    error Marketplace__ProjectIsNotOverdue();
    error Marketplace__ProjectReviewPeriodEnded();
    error Marketplace__ReviewNotOverdue();
    // change orders
    error Marketplace__ChangeOrderCannotBeProposed();
    error Marketplace__ChangeOrderAlreadyExists();
    error Marketplace__AdjustedFeeExceedsProjectFee();
    error Marketplace__ForfeitExceedsProviderStake();
    error Marketplace__NoActiveChangeOrder();
    error Marketplace__ChangeOrderNotValid();
    error Marketplace__AlreadyApprovedChangeOrder();
    error Marketplace__ChangeOrderPeriodStillActive();
    error Marketplace__InvalidSettlement();
    // mediation
    error Marketplace__ProjectCannotBeDisputed();
    error Marketplace__ProjectIsNotDisputed();
    error Marketplace__MediationServiceHasNotRuled();
    error Marketplace__AppealPeriodOver();
    error Marketplace__AppealPeriodNotOver();
    error Marketplace__OnlyNonPrevailingParty();
    error Marketplace__MediationServiceHasNotDismissedCase();
    error Marketplace__MediationServiceCaseAlreadyInitiated();
    
    modifier onlyUser() {
        if (!WHITELIST.isApproved(msg.sender)) revert Marketplace__OnlyUser();
        _;
    }

    modifier onlyGovernor() {
        if (msg.sender != GOVERNOR) revert Marketplace__OnlyGovernor();
        _;
    }

    constructor(
        address _governor,
        address _whitelist,
        address _mediationService,
        address _escrowFactory,
        address[] memory _approvedTokens
    )
    {
        GOVERNOR = _governor;
        WHITELIST = IWhitelist(_whitelist);
        MEDIATION_SERVICE = IMediationService(_mediationService);
        ESCROW_FACTORY = IEscrowFactory(_escrowFactory);
        for (uint i = 0; i < _approvedTokens.length; ++i) {
            _approveToken(_approvedTokens[i]);
        }
    }

    fallback() external payable {} 
    receive() external payable {} 

    /**
     * @notice creates a Project in Marketplace and deploys an associated Escrow contract
     * @dev project ID cannot be zero
     * @return ID of newly created Project
     */
    function createProject(
        address _provider,
        address _paymentToken,
        uint256 _projectFee,
        uint256 _providerStake,
        uint256 _dueDate,
        uint256 _reviewPeriodLength,
        string memory _detailsURI
    ) 
        external 
        payable
        onlyUser 
        returns (uint256) 
    {
        if (_provider == msg.sender || _provider == address(0)) revert Marketplace__InvalidProviderAddress();
        if (_dueDate < block.timestamp || _dueDate > block.timestamp + 365 days) revert Marketplace__InvalidDueDate();
        if (_reviewPeriodLength > 30 days) revert Marketplace__InvalidReviewPeriodLength();
        uint256 txFee = calculateNebulaiTxFee(_projectFee, _paymentToken);
        projectIds.increment(); 
        Project memory p;
        p.projectId = projectIds.current();
        p.buyer = msg.sender;
        p.provider = _provider;
        p.escrow = ESCROW_FACTORY.createEscrowContract(
            address(this),
            p.projectId,
            msg.sender,
            _provider,
            _paymentToken,
            _projectFee,
            _providerStake,
            address(MEDIATION_SERVICE),
            _detailsURI
        );
        p.paymentToken = _paymentToken;
        p.providerStake = _providerStake;
        p.dueDate = _dueDate;
        p.reviewPeriodLength = _reviewPeriodLength; 
        p.nebulaiTxFee = txFee; 
        p.detailsURI = _detailsURI;
        p.projectFee = _projectFee; 
        txFeesHeld[p.projectId] = txFee;
        projects[p.projectId] = p;

        if (_paymentToken != address(0)) {
            if (!isApprovedToken[_paymentToken]) revert Marketplace__UnapprovedToken();
            if (IERC20(_paymentToken).allowance(msg.sender, address(this)) < txFee + _projectFee) {
                revert Marketplace__InsufficientApproval();
            }
            if (msg.value > 0) revert Marketplace__NativeCurrencySent();
            bool success = IERC20(_paymentToken).transferFrom(msg.sender, address(this), txFee);
            if (!success) revert Marketplace__TransferFailed();
            success = IERC20(_paymentToken).transferFrom(msg.sender, p.escrow, _projectFee);
            if (!success) revert Marketplace__TransferFailed();
        } else {
            if (msg.value < txFee + _projectFee) revert Marketplace__InsufficientAmount();
            (bool success, ) = p.escrow.call{value: _projectFee}("");
            if (!success) revert Marketplace__TransferFailed();
        }
        
        emit ProjectCreated(p.projectId, p.buyer, p.provider);
        return p.projectId;
    }

    /**
     * @notice Closes the Project and performs the following actions:
     *   - Releases projectFee to Buyer from Escrow
     *   - Refunds txFee to Buyer
     * 
     * @notice **Prerequisite:** Project must not be activated by the Provider
     */
    function cancelProject(uint256 _projectId) external {
        Project storage p = projects[_projectId];
        if (msg.sender != p.buyer) revert Marketplace__OnlyBuyer();
        if (p.status != Status.Created) revert Marketplace__ProjectCannotBeCancelled();
        uint256 txFeeRefund = getTxFeesHeld(_projectId);
        p.status = Status.Cancelled;
        txFeesHeld[_projectId] -= txFeeRefund; 
        if (p.paymentToken != address(0)) {
            bool success = IERC20(p.paymentToken).transfer(msg.sender, txFeeRefund);
            if (!success) revert Marketplace__TransferFailed();
        } else {
            (bool success,) = msg.sender.call{value: txFeeRefund}("");
            if (!success) revert Marketplace__TransferFailed();
        }
        emit ProjectCancelled(_projectId, p.buyer, p.provider);
    }

    /**
     * @notice Provider stakes in Escrow and begins working on Project
     * @notice Tx fees paid on Project creation become non-refundable
     */
    function activateProject(uint256 _projectId) external payable onlyUser {
        Project storage p = projects[_projectId];
        if (msg.sender != p.provider) revert Marketplace__OnlyProvider();
        if (p.status != Status.Created) revert Marketplace__ProjectCannotBeActivated();
        txFeesPaid[p.paymentToken] += txFeesHeld[_projectId];
        txFeesHeld[_projectId] = 0;
        p.status = Status.Active;
        if (p.providerStake > 0) {
            if (p.paymentToken != address(0)) {
                if (IERC20(p.paymentToken).allowance(msg.sender, address(this)) < p.providerStake) {
                    revert Marketplace__InsufficientApproval();
                }
                if (msg.value > 0) revert Marketplace__NativeCurrencySent();
                bool success = IERC20(p.paymentToken).transferFrom(msg.sender, p.escrow, p.providerStake);
                if (!success) revert Marketplace__TransferFailed();
            } else {
                if (msg.value < p.providerStake) revert Marketplace__InsufficientAmount();
                (bool success,) = p.escrow.call{value: p.providerStake}("");
                if (!success) revert Marketplace__TransferFailed();
            }
        }
        require(IEscrow(p.escrow).verifyProviderStake());
        emit ProjectActivated(_projectId, p.buyer, p.provider);
    }

    /**
     * @notice Allows either Buyer or Provider to discontinue Project and propose a Change Order
     * @param _changeOrderDetailsURI details of Change Order on distributed file system
     */
    function discontinueProject(
        uint256 _projectId,
        uint256 _adjustedProjectFee,
        uint256 _providerStakeForfeit,
        string memory _changeOrderDetailsURI    
    ) 
        external 
    {
        Project storage p = projects[_projectId];
        if (msg.sender != p.buyer && msg.sender != p.provider) revert Marketplace__OnlyBuyerOrProvider();
        if (p.status != Status.Active) revert Marketplace__ProjectMustBeActive();
        p.status = Status.Discontinued;
        p.changeOrderPeriodInitiated = block.timestamp;
        _proposeChangeOrder(
            _projectId,
            _adjustedProjectFee,
            _providerStakeForfeit,
            _changeOrderDetailsURI
        );
        emit ProjectDiscontinued(_projectId, p.buyer, p.provider);
    }

    /**
     * @notice Provider claims Project is complete and reviewPeriod is initiated
     */
    function completeProject(uint256 _projectId) external {
        Project storage p = projects[_projectId];
        if (msg.sender != p.provider) revert Marketplace__OnlyProvider();
        if (p.status != Status.Active) revert Marketplace__ProjectMustBeActive();
        p.status = Status.Completed;
        p.dateCompleted = block.timestamp;
        emit ProjectCompleted(p.projectId, p.buyer, p.provider);
    }

    /**
     * @notice Buyer approves, Project is closed and Escrow releases funds according to Project details
     */
    function approveProject(uint256 _projectId) external {
        Project storage p = projects[_projectId];
        if (msg.sender != p.buyer) revert Marketplace__OnlyBuyer();
        if (p.status != Status.Completed) revert Marketplace__ProjectNotCompleted();
        p.status = Status.Approved;
        emit ProjectApproved(p.projectId, p.buyer, p.provider);
    }

    /**
     * @notice Buyer challenges completed Project and proposes Change Order
     * @param _changeOrderDetailsURI details of Change Order on distributed file system
     */
    function challengeProject(
        uint256 _projectId,
        uint256 _adjustedProjectFee,
        uint256 _providerStakeForfeit,
        string memory _changeOrderDetailsURI 
    ) 
        external 
    {
        Project storage p = projects[_projectId];
        if (msg.sender != p.buyer) revert Marketplace__OnlyBuyer();
        if (p.status != Status.Active && p.status != Status.Completed) revert Marketplace__ProjectCannotBeChallenged();
        if (p.status == Status.Active && block.timestamp < p.dueDate) revert Marketplace__ProjectIsNotOverdue();
        if (p.status == Status.Completed && block.timestamp > p.dateCompleted + p.reviewPeriodLength) {
            revert Marketplace__ProjectReviewPeriodEnded();
        } 
        p.status = Status.Challenged;
        p.changeOrderPeriodInitiated = block.timestamp;
        _proposeChangeOrder(
            _projectId,
            _adjustedProjectFee,
            _providerStakeForfeit,
            _changeOrderDetailsURI
        );
        emit ProjectChallenged(_projectId, p.buyer, p.provider);
    }

    /**
     * @notice closes Project and Escrow releases funds according to Project details
     * @notice can only be called after reviewPeriod has elapsed and Buyer has not approved or challenged
     */
    function reviewOverdue(uint256 _projectId) external {
        Project storage p = projects[_projectId];
        if (msg.sender != p.provider) revert Marketplace__OnlyProvider();
        if (p.status != Status.Completed || block.timestamp < p.dateCompleted + p.reviewPeriodLength) {
            revert Marketplace__ReviewNotOverdue();
        }
        p.status = Status.Resolved_ReviewOverdue;
        emit ReviewOverdue(_projectId, p.buyer, p.provider); 
    }

    /////////////////////
    ///   MEDIATION   ///
    /////////////////////

    /**
     * @notice initiates mediation by creating a Dispute in MediationService contract
     * @notice can only be called after a Change Order has failed to be approved within CHANGE_ORDER_PERIOD
     * @dev deactivates existing (non-approved) Change Order
     * @return ID of Dispute in MediationService contract
     */
    function disputeProject(
        uint256 _projectId,
        uint256 _adjustedProjectFee,
        uint256 _providerStakeForfeit
    ) 
        external 
        returns (uint256)
    {
        Project storage p = projects[_projectId];
        if (msg.sender != p.buyer && msg.sender != p.provider) revert Marketplace__OnlyBuyerOrProvider();
        if (p.status != Status.Challenged && p.status != Status.Discontinued) revert Marketplace__ProjectCannotBeDisputed();
        if (block.timestamp < p.changeOrderPeriodInitiated + CHANGE_ORDER_PERIOD) {
            revert Marketplace__ChangeOrderPeriodStillActive();
        }
        p.status = Status.Disputed;
        ChangeOrder storage order = changeOrders[_projectId][changeOrders[_projectId].length - 1];
        order.active = false;

        if (_adjustedProjectFee > p.projectFee) revert Marketplace__AdjustedFeeExceedsProjectFee();
        if (_providerStakeForfeit > p.providerStake) revert Marketplace__ForfeitExceedsProviderStake();
        uint256 disputeId = MEDIATION_SERVICE.createDispute(
            p.projectId,
            _adjustedProjectFee,
            _providerStakeForfeit,
            (msg.sender == p.buyer) ? p.buyer : p.provider,
            (msg.sender == p.buyer) ? p.provider : p.buyer
        );
        mediationCases[_projectId] = disputeId;
        emit ProjectDisputed(p.projectId, p.buyer, p.provider, disputeId);
        return disputeId;
    }

    /**
     * @notice creates a new Dispute in MediationService contract with same details of original mediation case
     * @notice can only called between rendering of original decision and end of APPEAL_PERIOD
     * @return ID of Dispute in MediationService contract
     */
    function appealDecision(uint256 _projectId) external returns (uint256) {
        Project storage p = projects[_projectId];
        if (msg.sender != p.buyer && msg.sender != p.provider) revert Marketplace__OnlyBuyerOrProvider();
        if (p.status != Status.Disputed) revert Marketplace__ProjectIsNotDisputed();
        Dispute memory dispute = MEDIATION_SERVICE.getDispute(mediationCases[_projectId]);
        if (dispute.phase != Phase.Decision) revert Marketplace__MediationServiceHasNotRuled();
        if (block.timestamp >= dispute.decisionRenderedDate + APPEAL_PERIOD) revert Marketplace__AppealPeriodOver();
        p.status = Status.Appealed;
        uint256 disputeId = MEDIATION_SERVICE.appeal(_projectId);
        mediationCases[_projectId] = disputeId;
        emit ProjectAppealed(_projectId, disputeId, msg.sender);
        return disputeId;
    }

    /**
     * @notice closes Project and Escrow releases funds according to Dispute in MediationService contract
     * @notice only non-prevailing party may waive the appeal
     */
    function waiveAppeal(uint256 _projectId) external {
        Project storage project = projects[_projectId];
        if (project.status != Status.Disputed) revert Marketplace__ProjectIsNotDisputed();
        Dispute memory dispute = MEDIATION_SERVICE.getDispute(mediationCases[_projectId]);
        if (dispute.phase != Phase.Decision) revert Marketplace__MediationServiceHasNotRuled();
        if (dispute.granted) {
            if(msg.sender != dispute.respondent) revert Marketplace__OnlyNonPrevailingParty();
        } else {
            if(msg.sender != dispute.claimant) revert Marketplace__OnlyNonPrevailingParty();
        }
        project.status = Status.Resolved_Mediation;
        emit ResolvedByMediation(project.projectId, dispute.disputeId);
    }

    /**
     * @notice Closes project and Escrow releases funds according to Dispute in MediationService contract
     * @notice if Dispute is not appeal, user must wait until after APPEAL_PERIOD elapses
     */
    function resolveByMediation(uint256 _projectId) public {
        Project storage project = projects[_projectId];
        if (msg.sender != project.buyer && msg.sender != project.provider) revert Marketplace__OnlyBuyerOrProvider();
        if (project.status != Status.Disputed) revert Marketplace__ProjectIsNotDisputed();
        Dispute memory dispute = MEDIATION_SERVICE.getDispute(mediationCases[_projectId]);
        if (dispute.phase != Phase.Decision && dispute.phase != Phase.DefaultDecision) {
            revert Marketplace__MediationServiceHasNotRuled();
        }
        if (!dispute.isAppeal) {
            if(block.timestamp < dispute.decisionRenderedDate + APPEAL_PERIOD) revert Marketplace__AppealPeriodNotOver();
        }
        project.status = Status.Resolved_Mediation;
        emit ResolvedByMediation(_projectId, dispute.disputeId);
    }

    /**
     * @notice closes Project and Escrow releases funds according to Project details
     * @notice Dispute can be dismissed in MediationService contract if neither party pays mediation fee
     */
    function resolveDismissedCase(uint256 _projectId) public {
        Project storage project = projects[_projectId];
        if (msg.sender != project.buyer && msg.sender != project.provider) revert Marketplace__OnlyBuyerOrProvider();
        if (project.status != Status.Disputed) revert Marketplace__ProjectIsNotDisputed();
        Dispute memory dispute = MEDIATION_SERVICE.getDispute(mediationCases[_projectId]);
        if (dispute.phase != Phase.Dismissed) revert Marketplace__MediationServiceHasNotDismissedCase();
        project.status = Status.Resolved_MediationDismissed;
        emit ResolvedByDismissedCase(_projectId, dispute.disputeId);
    }

    /**
     * @notice creates a new Change Order during mediation
     * @notice can only be created during Disclosure phase of mediationService dispute
     * @param _settlementDetailsURI details of Change Order on distributed file system
     */
    function proposeSettlement( 
        uint256 _projectId,
        uint256 _adjustedProjectFee,
        uint256 _providerStakeForfeit,
        string memory _settlementDetailsURI
    ) 
        external 
    {
        Project memory project = projects[_projectId];
        if (msg.sender != project.buyer && msg.sender != project.provider) revert Marketplace__OnlyBuyerOrProvider();
        if (project.status != Status.Disputed) revert Marketplace__ProjectIsNotDisputed();
        Dispute memory dispute = MEDIATION_SERVICE.getDispute(getDisputeId(project.projectId));
        if (dispute.phase != Phase.Disclosure) revert Marketplace__MediationServiceCaseAlreadyInitiated();
        _proposeChangeOrder(
            _projectId,
            _adjustedProjectFee,
            _providerStakeForfeit,
            _settlementDetailsURI
        );
        emit SettlementProposed(_projectId, getDisputeId(_projectId));
    }

    ////////////////////////
    ///   CHANGE ORDER   ///
    ////////////////////////

    /**
     * @notice creates a new Change Order and sets approval as true for user who proposes it
     * @dev sets 'active' field on most recent Change Order to false, ensuring only one active Change Order per Project
     */
    function _proposeChangeOrder(
        uint256 _projectId,
        uint256 _adjustedProjectFee,
        uint256 _providerStakeForfeit,
        string memory _changeOrderDetailsURI
    ) 
        private 
    {
        Project memory p = getProject(_projectId);
        if (_adjustedProjectFee > p.projectFee) revert Marketplace__AdjustedFeeExceedsProjectFee();
        if (_providerStakeForfeit > p.providerStake) revert Marketplace__ForfeitExceedsProviderStake();
        changeOrderIds.increment();
        ChangeOrder memory newOrder = ChangeOrder({
            changeOrderId: changeOrderIds.current(),
            projectId: _projectId,
            dateProposed: block.timestamp,
            proposedBy: msg.sender,
            adjustedProjectFee: _adjustedProjectFee,
            providerStakeForfeit: _providerStakeForfeit,
            active: true,
            buyerApproval: (msg.sender == p.buyer) ? true : false,
            providerApproval: (msg.sender == p.provider) ? true : false,
            detailsURI: _changeOrderDetailsURI
        }); 
        ChangeOrder[] storage orders = changeOrders[_projectId];
        if (orders.length > 0) {
            orders[orders.length - 1].active = false;
        } 
        orders.push(newOrder);
        changeOrders[_projectId] = orders;
        emit ChangeOrderProposed(_projectId);
    }

    /**
     * @notice closes Project and Escrow releases funds according to Change Order
     */
    function approveChangeOrder(uint256 _projectId) external {
        if (!activeChangeOrder(_projectId)) revert Marketplace__NoActiveChangeOrder();
        Project storage p = projects[_projectId];
        if (msg.sender != p.buyer && msg.sender != p.provider) revert Marketplace__OnlyBuyerOrProvider();
        if (
            p.status != Status.Discontinued &&
            p.status != Status.Challenged && 
            p.status != Status.Disputed
        ) revert Marketplace__ChangeOrderNotValid(); 
        ChangeOrder storage c = changeOrders[_projectId][changeOrders[_projectId].length -1];
        if (
            msg.sender == p.buyer && c.buyerApproval ||
            msg.sender == p.provider && c.providerApproval
        ) revert Marketplace__AlreadyApprovedChangeOrder();
        if (msg.sender == p.buyer) c.buyerApproval = true;
        if (msg.sender == p.provider) c.providerApproval = true;
        if (p.status == Status.Disputed) {
            _validSettlement(p.projectId);
        }
        p.status = Status.Resolved_ChangeOrder;
        emit ChangeOrderApproved(p.projectId, p.buyer, p.provider);
    }
    
    /**
     * @dev updates Dispute phase in MediationService contract if Change Order is settlement
     */
    function _validSettlement(uint256 _projectId) private {
        Dispute memory dispute = MEDIATION_SERVICE.getDispute(getDisputeId(_projectId));
        if (dispute.phase != Phase.Disclosure) revert Marketplace__ChangeOrderNotValid();
        MEDIATION_SERVICE.settledExternally(dispute.disputeId);
    }

    ////////////////
    ///   UTIL   ///
    ////////////////

    function calculateNebulaiTxFee(uint256 _projectFee, address _paymentToken) public view returns (uint256) {
        uint256 decimals = 18;
        if (_paymentToken != address(0)) {
            decimals = IERC20Metadata(_paymentToken).decimals();
            if (decimals == 0) decimals = 18; 
        }
        uint256 minTxFee = MINIMUM_TX_FEE * (10 ** decimals);
        uint256 txFee = (_projectFee * nebulaiTxFee) / 100;
        if (txFee < minTxFee) txFee = minTxFee;
        return txFee;
    }

    function _approveToken(address _token) private {
        erc20Tokens.push(_token);
        isApprovedToken[_token] = true;
    }

    /**
     * @notice called by Escrow after tranferring commission fee to Marketplace when Provider withdraws
     */
    function receiveCommission(uint256 _projectId, uint256 _commission) external {
        Project memory project = getProject(_projectId);
        if (msg.sender != project.escrow) revert Marketplace__CommissionMustBePaidByEscrow();
        commissionFees[project.paymentToken] += _commission;
        emit CommissionFeeReceived(_projectId, _commission, project.paymentToken);
    }

    /**
     * @notice called by Escrow after user withdraws 
     */
    function escrowWithdrawnEvent(uint256 _projectId, address _user, uint256 _amount, uint256 _commissionPaid) external {
        Project memory project = getProject(_projectId);
        if (msg.sender != project.escrow) revert Marketplace__EscrowWithdrawError();
        emit EscrowWithdrawn(project.projectId, _user, project.escrow, _amount, _commissionPaid);
    }

    //////////////////////
    ///   GOVERNANCE   ///
    //////////////////////

    function setNebulaiTxFee(uint256 _feePercentage) external onlyGovernor {
        require(_feePercentage > 0 && _feePercentage < 10);
        nebulaiTxFee = _feePercentage;
        emit NebulaiTxFeeChanged(_feePercentage);
    }

    function approveToken(address _erc20) external onlyGovernor {
        _approveToken(_erc20);
        emit ERC20Approved(_erc20);
    }

    function removeToken(address _erc20) external onlyGovernor { 
        isApprovedToken[_erc20] = false;
        emit ERC20Removed(_erc20);
    }

    /**
     * @dev transfers all releasable fees paid in native currency and ERC20 tokens 
     */
    function withdrawFees(address _recipient) external onlyGovernor {
        for (uint i; i < erc20Tokens.length; ++i) {
            uint256 erc20Fees = txFeesPaid[erc20Tokens[i]] + commissionFees[erc20Tokens[i]];
            txFeesPaid[erc20Tokens[i]] = 0;
            commissionFees[erc20Tokens[i]] = 0;
            if (erc20Fees > 0) {
                bool erc20TransferSuccess = IERC20(erc20Tokens[i]).transfer(_recipient, erc20Fees);
                if (!erc20TransferSuccess) revert Marketplace__TransferFailed();
                emit FeesWithdrawnERC20(_recipient, erc20Tokens[i], erc20Fees);
            }
        }

        uint256 nativeFees = txFeesPaid[address(0)] + commissionFees[address(0)];
        txFeesPaid[address(0)] = 0;
        commissionFees[address(0)] = 0;
        if (nativeFees > 0) {
            (bool success, ) = _recipient.call{value: nativeFees}("");
            if (!success) revert Marketplace__TransferFailed();
        }
        emit FeesWithdrawnNative(_recipient, nativeFees);
    }

    ///////////////////
    ///   GETTERS   ///
    ///////////////////

    function getProject(uint256 _projectId) public view returns (Project memory) {
        return projects[_projectId];
    }

    function getProjectStatus(uint256 _projectId) public view returns (Status) {
        Project memory project = getProject(_projectId);
        return project.status;
    }

    function isDisputed(uint256 _projectId) public view returns (bool) {
        return projects[_projectId].status == Status.Disputed;
    }

    function getTxFeesHeld(uint256 _projectId) public view returns (uint256) {
        return txFeesHeld[_projectId];
    }

    function getTxFeesPaid(address _paymentToken) public view returns (uint256) {
        return txFeesPaid[_paymentToken];
    }

    function getCommissionFees(address _paymentToken) public view returns (uint256) {
        return commissionFees[_paymentToken];
    }

    function getChangeOrders(uint256 _projectId) public view returns (ChangeOrder[] memory) {
        return changeOrders[_projectId];
    }

    function getActiveChangeOrder(uint256 _projectId) public view returns (ChangeOrder memory) {
        if (!activeChangeOrder(_projectId)) revert Marketplace__NoActiveChangeOrder();
        return changeOrders[_projectId][changeOrders[_projectId].length - 1];
    }

    function activeChangeOrder(uint256 _projectId) public view returns (bool) {
        ChangeOrder[] memory orders = getChangeOrders(_projectId);
        if (orders.length > 0 && orders[orders.length - 1].active) {
            return true;
        }
        return false;
    }

    function getDisputeId(uint256 projectId) public view returns (uint256) {
        return mediationCases[projectId];
    }

    function getErc20Tokens() public view returns (address[] memory) {
        return erc20Tokens;
    }

}