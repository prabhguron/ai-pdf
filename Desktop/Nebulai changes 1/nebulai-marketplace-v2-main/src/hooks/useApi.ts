import { useCallback } from "react";
import axiosApiInstance from "@/helpers/axiosApiInstance";

interface Option{
  headers ?: any;
  data: {key: string, value: any} | {};
  params: {key: string, value: any} | {};
  method: string;
  url: string
}

export const useApi = () => {
  const axiosApi = useCallback(
    async (
      path: string,
      method: string,
      payload = {},
      params = {},
      headers: any = null
    ) => {
      const options: Option = {
        data: payload,
        params,
        method,
        url: `${process.env.NEXT_PUBLIC_API_URL}${path}`,
      };
      if (headers !== null) {
        options.headers = headers;
      }
      const response: any = await axiosApiInstance.request(options);
      return response.response ?? response;
    },
    []
  );
  return axiosApi;
};
