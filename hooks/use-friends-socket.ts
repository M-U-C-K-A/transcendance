import { useEffect } from "react"
import { useJWT } from "@/hooks/use-jwt"

export function useFriendSocket(onMessage: (data: any) => void) {
  const token = useJWT()

  useEffect(() => {
	if (!token) return

	const socket = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_FOR_FRIENDS || "" , [token])

	socket.onmessage = (event) => {
	  const data = JSON.parse(event.data)
	  onMessage(data)
	}

	return () => {
	  socket.close()
	}
  }, [token])
}
