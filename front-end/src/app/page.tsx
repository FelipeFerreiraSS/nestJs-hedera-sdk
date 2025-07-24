"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react";

import PageLoader from "@/components/ui/pageLoading";
import useAuth from "@/hooks/auth/useAuth";

export default function Home() {
  const {
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
    isReady,
    handleConnect,
    handleDisconnect
  } = useAuth()
  
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Card className="w-[500px] min-h-[310px] flex items-center">
          <CardContent>
            <Tabs defaultValue="login" className="w-[400px]">
              <TabsList>
                <TabsTrigger value="login">Tenho uma carteira</TabsTrigger>
                <TabsTrigger value="cadastro">Criar nova carteira</TabsTrigger>
                <TabsTrigger value="hashpack">HashPack</TabsTrigger>
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
              <TabsContent value="hashpack">
                <div className="w-full flex justify-center items-center">
                  <Button 
                    className="cursor-pointer"
                    onClick={handleConnect} 
                    disabled={!isReady}
                  >
                    Login com a HashPack
                  </Button>
                  <Button onClick={handleDisconnect}>
                    Desconectar
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <PageLoader isLoading={isLoading}/>
      </main>
    </div>
  );
}
