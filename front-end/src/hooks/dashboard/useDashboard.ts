import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"
import services from "@/services";
import useFetch from "../useFetch";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

type FetchType = {
  "id": number,
  "name": string,
  "account": string,
  "privateKey": string,
  "createdAt": string,
  "updatedAt": string,
  "userId": number
}[];

type FormValues = {
  name: string
}

const useDashboard = () => {
  const [accountId, setAccountId] = useState('')
  const [privateKey, setPrivateKey] = useState('')
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('')

  const router = useRouter()

  const logout = () => {
    localStorage.clear();
    router.push("/")
  }

   const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm<FormValues>()

  const criateNewSection = async (data: FormValues) => {
    try {
      setIsLoading(true)
      const {name} = data
      const response = await services.section.criateSection({name});

      if (response.status === 201) {
        toast.success("Nova section criada com sucesso!")
      }

      fetchData()
      reset()

      setIsLoading(false)
    } catch (error: any) {
      toast.error("Erro ao criar nova section", {
        description: error?.response?.data || error.message,
      })
      setIsLoading(false)
    }
  }

  const { data, fetchData, isLoading: isLoadingData } = useFetch<FetchType>({
    request: { get: services.section.fetchAll },
  });
  
  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const localSotage = services.localSotageServices.getToken();
    const isValid = (value: string | null) =>
    value !== null && value !== undefined && value.trim() !== '';

    if (isValid(localSotage.storedAccountId) && isValid(localSotage.storedPrivateKey)) {
      setAccountId(localSotage.storedAccountId as string)
      setPrivateKey(localSotage.storedPrivateKey as string)
      setName(localSotage.storedName as string)
    } else {
      router.push("/")
    }
  }, [])

  return {
    accountId,
    privateKey,
    isLoading,
    name,
    data,
    isLoadingData,
    criateNewSection,
    register,
    handleSubmit,
    errors,
    logout
  };
};

export default useDashboard;