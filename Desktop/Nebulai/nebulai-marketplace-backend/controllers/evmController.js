const { generateNonce, SiweMessage } = require("siwe");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const { URL } = require('url');
const _ = require('lodash');
const AppError = require("../utils/appError");
const { approveAddress, isApproved, revokeApproval } = require("../contract/Whitelist");
const { checkIfWalletLinkedWithSomeOtherUser } = require("../resources/users");
const { mintFaucet } = require("../contract/NebulaiTestToken");
const { ethers } = require("ethers");
const { generateToken } = require("./JWTController");

/**
 * Generates Signature Message using SIWE(Sign In With Ethereum)
 * @name generateSignatureMsg
 * @return {json} returns a message.
 */
exports.generateSignatureMsg = (req, res, next) => {
    let message = null;
    try {
        const {address, chainId, link} = req.body
        const dappUrl = new URL(process.env.DAPP_URL);

        const now = new Date();
        const formattedTime = now.toString();
        let statementFormatted = `I want to ${link ? 'link my wallet to my account' : 'login'} on ${dappUrl.origin} at ${formattedTime}. I accept the Nebulai Terms and Conditions ${dappUrl.origin}/terms/`

        const message = new SiweMessage({
            domain: dappUrl.host,
            address,
            statement: statementFormatted,
            uri: dappUrl.origin,
            version: '1',
            chainId,
            expirationTime: new Date(now.getTime() + 15 * 60000).toISOString(), // 15 minutes
            nonce: generateNonce()
        });
        return res.status(201).json({message: message.prepareMessage()})
    } catch (error) {
        console.log(error.message);
    }
    return res.status(500).json({message})
};

exports.linkWallet = catchAsync(async (req, res, next) => {
  const { user, walletName, message, signature } = req.body;
  if (!user) {
    return next(new AppError('User not found', 404, 'error'));
  }
  try {
    const siweMessage = await validateSiweMessage(message, signature)
    if(siweMessage){
      const addressToLink =  siweMessage.address.toLowerCase();

      const linkedWithOther = await checkIfWalletLinkedWithSomeOtherUser(addressToLink, [user?._id]);
      if(linkedWithOther){
        return next(new AppError(`Address ${addressToLink} is already associated with some other account`, 400, 'error'));
      }

      if(_.includes(user.linkedWallets, addressToLink)){
          return res.status(200).json({
              status: "error",
              message: `Address ${addressToLink} is already associated with your account`
          });
      }
      user.linkedWallets.push({
        name: walletName,
        address: addressToLink
      });
      //Check and add user to whitelist
      const isWalletApproved = await isApproved(addressToLink);
      console.log('isWalletApproved', addressToLink, isWalletApproved);
      if(!isWalletApproved){
          const result = await approveAddress(addressToLink);
          console.log('approveAddress TX ', result)
          if(!result) {
            return next(new AppError('Wallet Address Approval Failed', 500, 'error'));
          }
      }
     
      if(process.env.NODE_ENV === 'development' && process.env.MINT_TEST_FAUCET == 'true'){
        await mintFaucet(addressToLink, ethers.utils.parseEther('1000'));
      }
      await user.save();
      return res.status(201).json({status:'success'});
    }
  } catch (error) {
    console.log(error.message);
  }
  return res.status(500).json({ status: 'error' });
});

exports.unLinkWallet = catchAsync(async (req, res, next) => {
    const { user, address } = req.body;
    try {
        const addressToUnLink = address.toLowerCase();
        if(!_.find(user.linkedWallets, {address: addressToUnLink})){
            return next(new AppError(`Address ${addressToUnLink} is not associated with this user account`, 400, 'error'));
        }
        user.linkedWallets = user.linkedWallets.filter(w => w.address.toLowerCase() !== addressToUnLink)
        //Check and revoke address from whitelist
        const isWalletApproved = await isApproved(addressToUnLink);
        if(isWalletApproved){
          const result = await revokeApproval(addressToUnLink);
          if(!result) {
            return next(new AppError('Wallet Address Revoke Approval Failed', 500, 'error'));
          }
        }
        await user.save();
        return res.status(200).json({status:'success'});
    } catch (error) {
      console.log(error.message);
    }
    return res.status(500).json({ status: 'error' });
  });

//login with wallet
exports.login = catchAsync(async (req, res, next) => {
    const { message, signature } = req.body;
    
    try {
      const siweMessage = await validateSiweMessage(message, signature)
      if(siweMessage){
        const signInAddress = siweMessage.address.toLowerCase();
        
        const user = await User.findOne({'linkedWallets.address': signInAddress});
        if(!user){
            return next(new AppError(`Address ${signInAddress} is not associated with any account`, 404, 'error'));
        }

        const jwtUserPayload = {
          _id: user._id,
          role: user.role,
          email: user.email,
          isEmailVerified: user.isEmailVerified
      }

        const token = generateToken(jwtUserPayload, (expiresIn = '1d'));
        const refreshToken = generateToken(jwtUserPayload, (expiresIn = '7d'), 'refresh');
        const cookieOptions = {
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          httpOnly: true,
        };
        if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  
        res.cookie('refreshToken', refreshToken, cookieOptions);
  

        return res.status(201).json({
            status:'success',
            token
        });
      }
    } catch (error) {
      console.log(error.message);
    }
    return res.status(500).json({ status: 'error' });
  });


  const validateSiweMessage = async (message, signature) => {
    const siweMessage = new SiweMessage(message);
    try {
        await siweMessage.validate(signature);
        return siweMessage;
    } catch (error) {
        console.log(error.message);
    }
    return null;
  }