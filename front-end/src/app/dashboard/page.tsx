"use client"
import { Button } from "@/components/ui/button"
import services from "@/services"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Dashboard() {
  const [accountId, setAccountId] = useState('')
  const [privateKey, setPrivateKey] = useState('')

  const router = useRouter()

  const logout = () => {
    localStorage.clear();
    router.push("/")
  }
  useEffect(() => {
    const localSotage = services.localSotageServices.getToken();
    const isValid = (value: string | null) =>
    value !== null && value !== undefined && value.trim() !== '';

    if (isValid(localSotage.storedAccountId) && isValid(localSotage.storedPrivateKey)) {
      setAccountId(localSotage.storedAccountId as string)
      setPrivateKey(localSotage.storedPrivateKey as string)
    } else {
      router.push("/")
    }
  }, [])
  
  return (
    <>dashboard conta: {accountId} Chave: {privateKey}
      <Button onClick={() => logout()}>
              Sair <LogOut />  
            </Button>
    </>
  )
}