import { useEffect } from "react"
import { useJWT } from "@/hooks/use-jwt"

export function useFriendSocket(onMessage: (data: any) => void) {
  const token = useJWT()

  useEffect(() => {
	if (!token) return

	const ws = process.env.NEXT_PUBLIC_WEBSOCKET_FOR_FRIENDS || ""
	const socket = new WebSocket(ws , [token])

	socket.onmessage = (event) => {
	  const data = JSON.parse(event.data)
	  onMessage(data)
	}

	return () => {
	  socket.close()
	}
  }, [token])
}