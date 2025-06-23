import { useEffect } from "react"

export function useFriendSocket(onMessage: (data: any) => void) {

  useEffect(() => {

	const ws = process.env.NEXT_PUBLIC_WEBSOCKET_FOR_FRIENDS || ""
	const socket = new WebSocket(ws)

	socket.onmessage = (event) => {
	  const data = JSON.parse(event.data)
	  onMessage(data)
	}

	return () => {
	  socket.close()
	}
  }, [])
}
