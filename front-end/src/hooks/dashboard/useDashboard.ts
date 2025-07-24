import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"
import services from "@/services";
import useFetch from "../useFetch";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

import {
  AccountId,
  PrivateKey,
  Client,
  TransferTransaction,
  Hbar,
  TransactionId,
  PublicKey,
} from '@hashgraph/sdk';
import axios from 'axios';
import * as crypto from 'crypto';

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


  // Dados da conta
const accountIdTeste = '0.0.6136725';
const privateKeyTeste = PrivateKey.fromStringDer('302e020100300506032b65700422042030c3f597f0b2e7e55711d68d959e65d271ffdaf1db8c1121a1390783c65f9e17');
const operatorAccount = AccountId.fromString('0.0.5173509'); // conta que vai receber os HBARs
const client = Client.forTestnet().setOperator(accountIdTeste, privateKeyTeste); // ou forMainnet

// Função de assinatura simples
function signMessage(message: string, privateKey: PrivateKey): Uint8Array {
  return privateKey.sign(Buffer.from(message));
}

// Envia aposta (passo completo)
async function placeBet() {
  try {
    // Parâmetros da aposta
    const amountTinybar = 10000000; // 0.1 HBAR
    const betChoices = ['heads']; // ou ['tails']

    // Cria transação de pagamento
    const tx = await new TransferTransaction()
      .addHbarTransfer(accountIdTeste, Hbar.fromTinybars(-amountTinybar))
      .addHbarTransfer(operatorAccount, Hbar.fromTinybars(amountTinybar))
      .setTransactionMemo('Coinflip Game Bet')
      .freezeWith(client);

    const signedTx = await tx.sign(privateKeyTeste);
    const submitTx = await signedTx.execute(client);
    const receipt = await submitTx.getReceipt(client);
    const transactionId = tx.transactionId?.toString();

    if (receipt.status.toString() !== 'SUCCESS') {
      throw new Error('Transação falhou');
    }

    // Mensagem que será assinada e enviada para a API
    const message = {
      transactionId,
      betChoices,
      playerAccount: accountIdTeste,
      betAmount: amountTinybar,
    };

    const messageStr = JSON.stringify(message);
    const signature = signMessage(messageStr, privateKeyTeste);

    console.log('payload', {
      walletId: accountIdTeste,
      message,
      signature: Buffer.from(signature).toString('base64'),
    });

    // Envia para API
    const response = await axios.post('http://localhost:3001/section/teste', {
      walletId: accountIdTeste,
      message,
      signature: Buffer.from(signature).toString('base64'),
    });

    console.log('Bet response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao processar aposta:', error);
    throw error;
  }
}
  
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
    logout,
    placeBet
  };
};

export default useDashboard;