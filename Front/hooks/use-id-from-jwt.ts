import { useEffect, useState } from "react"
import { useJWT } from "./use-jwt" // adaptez le chemin selon votre structure

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

export function useIdFromJWT() {
  const token = useJWT()
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    if (token) {
      const payload = parseJwt(token)
      // Vous pouvez adapter 'id', 'sub' ou autre selon ce que votre JWT contient
      if (payload && (payload.id || payload.sub)) {
        setUserId(payload.id || payload.sub)
      } else {
        setUserId(null)
      }
    } else {
      setUserId(null)
    }
  }, [token])

  return userId
}