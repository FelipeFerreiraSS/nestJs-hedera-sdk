"use client"
import { Button } from "@/components/ui/button"
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
    const storedAccountId = localStorage.getItem('accountId')
    const storedPrivateKey = localStorage.getItem('privateKey')
    if (storedAccountId && storedPrivateKey) {
      setAccountId(storedAccountId)
      setPrivateKey(storedPrivateKey)
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