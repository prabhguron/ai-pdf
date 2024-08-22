"use client"
import { useAppSelector } from "@/redux/store";
import ContractCreationStep from "./ContractCreationStep";
//import SendOffer from "./SendOffer";
import CreateContractChain from "./CreateContractChain";

const ContractStepContent = () => {
  const currentStep = useAppSelector(
    (state) => state.contractSteps.currentStep
  );

  let stepToRender = <h1>Something Went Wrong ☹️</h1>;
  switch (currentStep) {
    case 1:
        stepToRender = <ContractCreationStep />;
        break;
    // case 2:
    //   stepToRender = <SendOffer/>;
    //   break;
    case 2:
      stepToRender = <CreateContractChain/>;
      break;
    default:
      break;
  }
  

  return (
    <div className="row p-4">
        <div className="col-12 tab-content short-list-tab-content">
            {stepToRender}
        </div>
    </div>
  )
};

export default ContractStepContent;
