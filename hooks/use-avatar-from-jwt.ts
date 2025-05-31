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

function bufferToDataUrl(buffer: any) {
  try {
    // Si c'est déjà une URL data ou HTTP
    if (typeof buffer === 'string') {
      if (buffer.startsWith('data:image/') || buffer.startsWith('http')) {
        return buffer;
      }
      // Si c'est une chaîne base64 simple
      return `data:image/png;base64,${buffer}`;
    }
    
    // Si c'est un objet Buffer sérialisé
    if (typeof buffer === 'object' && buffer !== null) {
      // Convertir l'objet buffer en tableau d'octets
      const bytes = Object.values(buffer) as number[];
      
      // Convertir les octets en chaîne de caractères de manière sûre
      let binaryString = '';
      const chunkSize = 1024;
      for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.slice(i, i + chunkSize);
        binaryString += String.fromCharCode.apply(null, chunk);
      }
      
      // Convertir en base64
      const base64 = btoa(binaryString);
      return `data:image/png;base64,${base64}`;
    }

    return null;
  } catch (error) {
    console.error('Error processing avatar:', error);
    return null;
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

