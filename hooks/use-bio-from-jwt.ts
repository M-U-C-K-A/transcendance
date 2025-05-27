import { useEffect, useState } from "react"
import { useJWT } from "./use-jwt" // adapte le chemin si besoin

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

export function useBioFromJWT() {
  const token = useJWT()
  const [bio, setBio] = useState<string | null>(null)

  useEffect(() => {
    if (token) {
      const payload = parseJwt(token)
      if (payload && payload.bio) {
        setBio(payload.bio)
      } else {
        setBio(null)
      }
    } else {
      setBio(null)
    }
  }, [token])

  return bio
}

