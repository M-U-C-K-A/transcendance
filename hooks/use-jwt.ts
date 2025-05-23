import { useEffect, useState } from "react"

export function useJWT(): string | null {
  const [jwt, setJWT] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("jwt") // ou sessionStorage
    if (token) {
      setJWT(token)
    }
  }, [])

  return jwt
}
