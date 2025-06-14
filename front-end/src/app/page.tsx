"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, LogOut } from "lucide-react";
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import PageLoader from "@/components/ui/pageLoading";

type FormValues = {
  accountId: string
  privateKey: string
  name?: string
}

type FormValuesNew = {
  nameNewWallet: string
}

export default function Home() {
  const [ newUser, setNewUser ] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>()
  const [ isLoading, setIsLoading  ] = useState(false)
  const { 
    register: registerNew, 
    handleSubmit: handleSubmitNew, 
    formState: { errors: errorsNew } 
  } = useForm<FormValuesNew>()

  const router = useRouter()

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true)
      const response = await axios.post('http://localhost:3001/auth', {
        accountId: data.accountId,
        privateKey: data.privateKey
      })
      

      if (response.data.newUser === true) {
        setNewUser(true)
      } else if (response.data.newUser === false) {
        toast.success("Login bem-sucedido!")
        localStorage.setItem('accountId', data.accountId)
        localStorage.setItem('privateKey', data.privateKey)
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
    }
  }

  const criateNewUser = async (data: FormValues) => {
    try {
      setIsLoading(true)
      const response = await axios.post('http://localhost:3001/users', {
        name: data.name,
        account: data.accountId
      })

      if (response.status === 201) {
        toast.success("Nova conta criada com sucesso!")
        localStorage.setItem('accountId', data.accountId)
        localStorage.setItem('privateKey', data.privateKey)
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
    }
  }

  const criateNewWallet = async (data: FormValuesNew) => {
    try {
      setIsLoading(true)
      const response = await axios.post('http://localhost:3001/users', {
        name: data.nameNewWallet,
      })

      if (response.status === 201) {
        toast.success("Nova carteira criada com sucesso!")
        localStorage.setItem('accountId', response.data.accountId)
        localStorage.setItem('privateKey', response.data.privateKey)
        router.push("/dashboard")
      }

      setIsLoading(false)
    } catch (error: any) {
      toast.error("Erro ao criar nova carteira", {
        description: error?.response?.data || error.message,
      })
    }
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Card className="w-[500px] min-h-[310px] flex items-center">
          <CardContent>
            <Tabs defaultValue="login" className="w-[400px]">
              <TabsList>
                <TabsTrigger value="login">Tenho uma carteira</TabsTrigger>
                <TabsTrigger value="cadastro">Criar nova carteira</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                  <div>
                    <Label className="mb-2">Account ID:</Label>
                    <Input
                      placeholder="Account ID (ex: 0.0.1234)"
                      {...register('accountId', { required: 'Account ID é obrigatório' })}
                    />
                    {errors.accountId && <p className="text-red-500 text-sm">{errors.accountId.message}</p>}
                  </div>

                  <div>
                    <Label className="mb-2">Private Key:</Label>
                    <Input
                      placeholder="Chave Privada"
                      type="password"
                      {...register('privateKey', { required: 'Chave privada é obrigatória' })}
                    />
                    {errors.privateKey && <p className="text-red-500 text-sm">{errors.privateKey.message}</p>}
                  </div>
                  
                  {newUser === false ? (
                    <Button type="submit" className="cursor-pointer">Login</Button>
                  ): null}
                </form>

                {newUser === true ? (
                  <>
                    <Alert className="mb-5 mt-5 bg-gray-200">
                      <AlertCircle />
                      <AlertTitle>Voce ainda nao tem conta no nosso sistema</AlertTitle>
                      <AlertDescription>
                        Adicione um nome a sua conta
                      </AlertDescription>
                    </Alert>
                    <form onSubmit={handleSubmit(criateNewUser)} className="flex flex-col gap-4">
                      <div>
                        <Label className="mb-2">Nome:</Label>
                        <Input
                          placeholder="Nome"
                          {...register('name', { required: 'Nome é obrigatório' })}
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                      </div>

                      <Button type="submit" className="cursor-pointer">Criar conta</Button>
                    </form>
                  </>
                ): null} 

              </TabsContent>
              <TabsContent value="cadastro">
                <form onSubmit={handleSubmitNew(criateNewWallet)} className="flex flex-col gap-4">
                  <div>
                    <Label className="mb-2">Nome:</Label>
                    <Input
                      placeholder="Nome"
                      {...registerNew('nameNewWallet', { required: 'Nome é obrigatório' })}
                    />
                    {errorsNew.nameNewWallet && <p className="text-red-500 text-sm">{errorsNew.nameNewWallet.message}</p>}
                  </div>

                  <Button type="submit" className="cursor-pointer">Criar carteira</Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <PageLoader isLoading={isLoading}/>
      </main>
    </div>
  );
}
