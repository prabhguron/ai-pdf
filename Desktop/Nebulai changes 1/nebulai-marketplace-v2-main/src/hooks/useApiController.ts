import NebulaiApi from '@/neb-api/NebulaiApi'
import { Address } from 'viem';

const useApiController = () => {
  const {generateSignatureMsg, updateUserPassword} = NebulaiApi();

  interface GetSigMessageInput{
    address: Address;
    chainId: number;
    link?: boolean;
  } 
  const getSigMessage = async (payload: GetSigMessageInput) => {
    let msg = null;
    try {
      const result = await generateSignatureMsg(payload);
      if (result && result.status && result.data) {
        const { message } = result.data;
        if (message && result.status == 201) {
          msg = message;
        }
      }
    } catch (error: any) {
      console.error(error.message)
    }
    return msg;
  }

  const updatePassword = async (payload: UpdatePasswordInput) => {
    const response = {
      message: 'Something went wrong',
      status: 'error',
      token: null
    }
    try {
      let res = await updateUserPassword(payload);
      if(res?.data){
        const {status, message, token} = res.data;
        if(status === "success" && token) {
          response.token = token;
        }
        response.message = message;
        response.status = status;
      }
    } catch (error: any) {
      console.log(error.message);
    }
    return response;
  }


  return {
    getSigMessage,
    updatePassword
  }
}


export default useApiController