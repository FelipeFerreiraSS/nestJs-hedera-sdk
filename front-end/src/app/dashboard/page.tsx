"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import PageLoader from "@/components/ui/pageLoading"
import { Hash, LogOut, SquareArrowOutUpRight } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import useDashboard from "@/hooks/dashboard/useDashboard"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import moment from "moment";

export default function Dashboard() {
  const {
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
  } = useDashboard()

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Card className="w-[1200px] min-h-[710px] flex items-center">
          <CardHeader className="w-[100%]">
            <CardTitle>Dashboard</CardTitle>
            <div className="w-[100%] flex justify-between">
              <div>
                Nome: {name} | Conta: {accountId} | Chave: {privateKey.length > 10 ? privateKey.slice(0, 10) + "..." : privateKey} | Saldo: {balanceAccount ?? '...'}
              </div>
              <Button onClick={() => logout()} className="cursor-pointer">
                Sair <LogOut />  
              </Button>
            </div>
          </CardHeader>
          <CardContent className="w-[100%]">
            <div className="mb-5">
              <form onSubmit={handleSubmit(criateNewSection)} className="flex flex-col gap-4">
                <div className="flex gap-2 items-end h-[30px]">
                  <div className="w-[200px]">
                    {/* <Label className="mb-2">Nome:</Label> */}
                    <Input
                      placeholder="Nome da Section"
                      {...register('name', { required: 'Nome é obrigatório' })}
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                  </div>
                  <Button type="submit" className="cursor-pointer">Criar nova Section</Button>
                </div>
              </form>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px] font-bold">id</TableHead>
                  <TableHead className="font-bold">Nome do setor</TableHead>
                  <TableHead className="font-bold">accountID</TableHead>
                  <TableHead className="font-bold">privateKey</TableHead>
                  <TableHead className="font-bold">Criado em</TableHead>
                  <TableHead className="font-bold">Atualizado em</TableHead>
                  <TableHead className="font-bold">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.account}</TableCell>
                    <TableCell>{item.privateKey.length > 10 ? item.privateKey.slice(0, 10) + "..." : item.privateKey}</TableCell>
                    <TableCell>{moment(item.createdAt).format("DD/MM/YY HH:mm")}</TableCell>
                    <TableCell>{moment(item.updatedAt).format("DD/MM/YY HH:mm")}</TableCell>
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger>
                        <a
                          href={`https://hashscan.io/testnet/account/${item.account}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Hash className="cursor-pointer" />
                        </a>
                        </TooltipTrigger>
                        <TooltipContent className="flex justify-center items-center gap-2">
                          <p>Ver conta no hashscan</p>
                          <SquareArrowOutUpRight size={12}/>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <PageLoader isLoading={isLoading || isLoadingData}/>
      </main>
    </div>
  )
}