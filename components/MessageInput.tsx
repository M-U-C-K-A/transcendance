import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Swords } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface MessageInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  onInvite: () => void
  placeholder: string
}

export function MessageInput({
  value,
  onChange,
  onSubmit,
  onInvite,
  placeholder
}: MessageInputProps) {
  return (
    <form onSubmit={onSubmit} className="flex gap-2 p-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button type="button" variant="outline" size="icon" onClick={onInvite}>
              <Swords className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Send game invitation</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" size="icon">
        <Send className="h-4 w-4" />
      </Button>
    </form>
  )
}
