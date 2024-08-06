import escrowABI from "@/abi/Escrow.json";
import { Address, usePublicClient } from "wagmi";


const useEscrowContract = (escrowAddress:Address) => {
  const publicClient = usePublicClient();

  const escrowAddressABI = {
    address: escrowAddress,
    abi: escrowABI,
  }
  
  const isReleasableFunds = async () => {
    try {
        const data = await publicClient.readContract({
          ...escrowAddressABI,
          functionName: "isReleasable",
        });
        return data as boolean;
    } catch (error) {}
    return false;
  };

  const hasWithdrawn = async (userAddress: Address | null) => {
    if(!userAddress) return false;
    try {
        const data = await publicClient.readContract({
          ...escrowAddressABI,
          functionName: "hasWithdrawn",
          args: [userAddress]
        });
        return data as boolean;
    } catch (error) {}
    return false;
  };

  const amountDueAndCommissionFee = async(userAddress: Address | null) => {
    if(!userAddress) return "0";
    try {
        const data = await publicClient.readContract({
          ...escrowAddressABI,
          functionName: "amountDue",
          args: [userAddress]
        });
        const result: any = data as BigInt;
        const amount = result?.[0] as BigInt;
        const commissionFee = result?.[1] as BigInt;
        return {
          amount: amount?.toString(),
          commissionFee: commissionFee?.toString()
        }
    } catch (error) {}
    return  {
      amount: "0",
      commissionFee: "0"
    };
  }


  return {
    isReleasableFunds,
    hasWithdrawn,
    amountDueAndCommissionFee
  }
};

export default useEscrowContract;
