import { useEffect, useState } from "react"
import { useJWT } from "./use-jwt" // adapte le chemin si besoin
import { useUsernameFromJWT } from "./use-username-from-jwt"

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

export function useAvatarFromJWT() {
  const token = useJWT()
  const username = useUsernameFromJWT()
  const [avatar, setAvatar] = useState<string | null>(null)

  useEffect(() => {
    if (token) {
      const payload = parseJwt(token)
      if (payload && payload.avatar) {
        setAvatar(payload.avatar)
      } else {
        setAvatar(`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${username}`)
      }
    } else {
      setAvatar(`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${username}`)
    }
  }, [token, username])

  return avatar
}

