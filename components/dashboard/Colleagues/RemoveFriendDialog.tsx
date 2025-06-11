import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"
import { useState } from "react"
import { useI18n } from "@/i18n-client"

interface RemoveFriendDialogProps {
  jwt: string
  username: string
  userId: number
  onRemove: () => void
}

export function RemoveFriendDialog({ jwt, username, userId, onRemove }: RemoveFriendDialogProps) {
  const t = useI18n()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRemoveFriend = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/friends/remove`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userId })
      })

      if (!response.ok) {
        throw new Error(await response.text() || 'Failed to remove friend')
      }

      setOpen(false)
      onRemove() // Callback pour mettre à jour l'état parent
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          className="h-8 w-8 p-0"
          aria-label={`${t('dashboard.colleagues.remove')} ${username}`}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('dashboard.colleagues.removeFriendTitle')}</DialogTitle>
          <DialogDescription>
            {t('dashboard.colleagues.removeFriendConfirmation', { username })}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            {t('common.cancel')}
          </Button>
          <Button
            variant="destructive"
            onClick={handleRemoveFriend}
            disabled={loading}
          >
            {loading ? t('common.removing') : t('common.remove')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
