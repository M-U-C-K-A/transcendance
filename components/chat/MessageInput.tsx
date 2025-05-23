import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import { Invitation } from "@/components/chat/Invitation"

type MessageInputProps = {
  value: string
  onChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  placeholder?: string
}

export function MessageInput({ value, onChange, onSubmit, placeholder = "Écrivez un message..." }: MessageInputProps) 
{
  return (
    <form onSubmit={onSubmit} className="flex gap-2 p-4">
      <Invitation/>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" size="icon" aria-label="Send message">
        <Send className="h-4 w-4" />
      </Button>
    </form>
  )
}
