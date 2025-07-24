import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation"
import services from "@/services";
import { toast } from "sonner"

import { LedgerId } from "@hashgraph/sdk";
import { HashConnect } from "hashconnect";

type FormValues = {
  accountId: string
  privateKey: string
  name?: string
}

type FormValuesNew = {
  nameNewWallet: string
}

const env = "testnet";
const appMetadata = {
    name: "Example dApp",
    description: "An example HashConnect dApp",
    icons: ["https://assets-global.website-files.com/61ce2e4bcaa2660da2bb419e/61cf5cc71c9324950d7e071d_logo-colour-white.svg"],
    url: "test.com"
};
const projectId = "bfa190dbe93fcf30377b932b31129d05";

const useAuth = () => {
  const [newUser, setNewUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const hashConnectRef = useRef<HashConnect | null>(null);
  const [isReady, setIsReady] = useState(false);

  const hashConnect = hashConnectRef.current

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<FormValues>()
  
  const { 
    register: registerNew, 
    handleSubmit: handleSubmitNew, 
    formState: { errors: errorsNew } 
  } = useForm<FormValuesNew>()

  const router = useRouter()

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true)
      const response = await services.auth.login(data);

      if (response.data.newUser === true) {
        setNewUser(true)
      } else if (response.data.newUser === false) {
        toast.success("Login bem-sucedido!")
        services.localSotageServices.saveToken(
          data.accountId, 
          data.privateKey, 
          response.data.userId, 
          response.data.name
        )
        router.push("/dashboard")
      } 
      
      if (response.data.message) {
        toast.error("Erro", {
          description: response.data.message,
        })
      }

      setIsLoading(false)
    } catch (error: any) {
      toast.error("Erro ao fazer login", {
        description: error?.response?.data || error.message,
      })
      setIsLoading(false)
    }
  }

  const criateNewUser = async (data: FormValues) => {
    try {
      const { accountId, privateKey, name = '' } = data
      setIsLoading(true)
      const response = await services.auth.createUser({accountId, name});

      if (response.status === 201) {
        toast.success("Nova conta criada com sucesso!")
        services.localSotageServices.saveToken(
          accountId, 
          privateKey, 
          response.data.id, 
          response.data.name
        )
        router.push("/dashboard")
      }

      if (response.data.message) {
        toast.error("Erro", {
          description: response.data.message,
        })
      }

      setIsLoading(false)
    } catch (error: any) {
      toast.error("Erro ao criar nova conta", {
        description: error?.response?.data || error.message,
      })
      setIsLoading(false)
    }
  }

  const criateNewWallet = async (data: FormValuesNew) => {
    try {
      setIsLoading(true)
      const response = await services.auth.createWallet(data);

      if (response.status === 201) {
        toast.success("Nova carteira criada com sucesso!")
        services.localSotageServices.saveToken(
          response.data.account, 
          response.data.privateKey, 
          response.data.userId, 
          response.data.name
        )
        router.push("/dashboard")
      }

      setIsLoading(false)
    } catch (error: any) {
      toast.error("Erro ao criar nova carteira", {
        description: error?.response?.data || error.message,
      })
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const init = async () => {
      if (typeof window === "undefined") return;

      const { HashConnect } = await import("hashconnect");
      const hashConnect = new HashConnect(
        LedgerId.fromString(env),
        projectId,
        appMetadata,
        true
      );

      await hashConnect.init();
      hashConnectRef.current = hashConnect;
      setIsReady(true);
    };

    init();
  }, []);

  const handleConnect = () => {
    if (isReady && hashConnect) {
      hashConnect.openPairingModal();
    }
  };

  const handleDisconnect = () => {
    if (isReady && hashConnect) {
      hashConnect.disconnect();
    }
  };

  console.log('111, isReady', isReady);
  console.log('111, hashConnect', hashConnect);
  

  useEffect(() => {
    if (!isReady || !hashConnect) return;

    console.log('isReady', isReady);
    console.log('hashConnect', hashConnect);

    const accounts = hashConnect.connectedAccountIds;
    console.log('accounts', accounts);
    
    console.log("Conta conectada:", accounts.map((id) => id.toString()));
  }, [ isReady, hashConnect ]);

  return {
    newUser,
    isLoading,
    register, 
    handleSubmit, 
    errors,
    registerNew,
    handleSubmitNew,
    errorsNew,
    onSubmit,
    criateNewUser,
    criateNewWallet,
    hashConnect,
    isReady,
    handleConnect,
    handleDisconnect
  };
};

export default useAuth;