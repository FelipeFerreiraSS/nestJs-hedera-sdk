import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation"
import services from "@/services";
import { toast } from "sonner"

type FormValues = {
  accountId: string
  privateKey: string
  name?: string
}

type FormValuesNew = {
  nameNewWallet: string
}

const useAuth = () => {
  const [newUser, setNewUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    criateNewWallet
  };
};

export default useAuth;