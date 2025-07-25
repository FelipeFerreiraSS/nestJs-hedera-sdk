import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"
import services from "@/services";
import useFetch from "../useFetch";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { AccountBalanceQuery, AccountId, Client, PrivateKey } from '@hashgraph/sdk';

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
  const [balanceAccount, setBalanceAccount] = useState('')

  const router = useRouter()

  const { data, fetchData, isLoading: isLoadingData } = useFetch<FetchType>({
    request: { get: services.section.fetchAll },
  });

  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm<FormValues>()

  const logout = () => {
    localStorage.clear();
    router.push("/")
  }

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
      getBalance()
      setIsLoading(false)
    } catch (error: any) {
      toast.error("Erro ao criar nova section", {
        description: error?.response?.data || error.message,
      })
      setIsLoading(false)
    }
  }

  const getBalance = async () => {
    try {
      if (!accountId || !privateKey) {
        console.error('Account ID ou Private Key não definido');
        return;
      }

      const ACCOUNT_ID = AccountId.fromString(accountId);
      const PRIVATE_KEY = PrivateKey.fromStringED25519(privateKey);
      
      const client = Client.forTestnet();

      client.setOperator(ACCOUNT_ID, PRIVATE_KEY);
      
      const balanceCheckTxAccount = await new AccountBalanceQuery()
        .setAccountId(ACCOUNT_ID)
        .execute(client);

      setBalanceAccount(balanceCheckTxAccount.hbars.toString());
    } catch (err) {
      console.error('Erro ao buscar saldo:', err);
    }
  };

  useEffect(() => {
    if (accountId && privateKey && balanceAccount === '') {
      getBalance();
    }
  }, [accountId, privateKey, balanceAccount]);

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const localSotage = services.localSotageServices.getLocalSotage();
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
    logout,
    balanceAccount
  };
};

export default useDashboard;