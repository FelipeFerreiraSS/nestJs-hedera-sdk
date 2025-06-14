"use client"

import { useEffect, useState } from "react"

type PageLoaderProps = {
  isLoading: boolean
}

export default function PageLoader({ isLoading }: PageLoaderProps) {
  const [visible, setVisible] = useState(isLoading)

  useEffect(() => {
    setVisible(isLoading)
  }, [isLoading])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[2px]">
      <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
}
