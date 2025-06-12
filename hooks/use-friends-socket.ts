import { useEffect } from "react"
import { useJWT } from "@/hooks/use-jwt"

export function useFriendSocket(onMessage: (data: any) => void) {
  const token = useJWT()

  useEffect(() => {
	if (!token) return

	const socket = new WebSocket(`wss://c1r3p11.42lehavre.fr:3001/wss/friends` , [token])

	socket.onmessage = (event) => {
	  const data = JSON.parse(event.data)
	  onMessage(data)
	}

	return () => {
	  socket.close()
	}
  }, [token])
}
