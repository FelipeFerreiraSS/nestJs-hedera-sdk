import { useCallback, useState } from "react";
import { IRequest } from "@/types/Request";

type IUseFetchProps<T> = {
  request: IRequest<T>;
};
function useFetch<T>(props: IUseFetchProps<T>) {
  const { request } = props;
  const [data, setData] = useState<T>([] as T);
  const [isLoading, setIsLoading] = useState(false);
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await request.get();
      setData(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [request]);
  return {
    data,
    isLoading,
    fetchData,
  };
}
export default useFetch;