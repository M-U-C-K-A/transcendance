import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Check, Clock, X } from "lucide-react"
import { useI18n } from "@/i18n-client"
import { useEffect, useState } from "react"
import { useJWT } from "@/hooks/use-jwt"

interface PendingInvitation {
  id: number;
  username: string;
  avatar?: string;
}

export function PendingInvitations({ locale }: { locale: string }) {
  const jwt = useJWT()
  const t = useI18n()

  const [pendingInvitations, setPendingInvitations] = useState<PendingInvitation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPendingInvitations = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/friends/pending`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        })
        if (!response.ok) throw new Error('Failed to fetch pending invitations')
        const data = await response.json()
        setPendingInvitations(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    if (jwt) fetchPendingInvitations()
  }, [jwt])

  const handleInvitationResponse = async (invitationId: number, accept: boolean) => {
    try {
      const response = await fetch(`/api/friends/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          invitationId,
          accept
        }),
      })
      if (!response.ok) throw new Error('Failed to respond to invitation')
      // Remove the invitation from the list
      setPendingInvitations(prev => prev.filter(inv => inv.id !== invitationId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  if (!jwt) return null

  if (error) {
    return (
      <Card className="bg-card border shadow-sm mt-4">
        <CardContent className="p-4 text-red-500">
          {error}
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className="bg-card border shadow-sm mt-4">
        <CardContent className="p-4">
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                </div>
                <div className="flex space-x-2">
                  <div className="h-8 w-16 bg-muted rounded animate-pulse" />
                  <div className="h-8 w-16 bg-muted rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border shadow-sm mt-4">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="flex items-center text-sm font-medium">
          <Clock className="mr-2 h-4 w-4" />
          {t('dashboard.colleagues.pendingInvitations')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {pendingInvitations.length > 0 ? (
          <div className="space-y-3">
            {pendingInvitations.map((invitation) => (
              <div key={invitation.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage
                      src={`/profilepicture/${invitation.id}.webp` || `/public/profilepicture/0.webp`}
                      alt={invitation.username}
                    />
                    <AvatarFallback>{invitation.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <p className="text-sm font-medium">{invitation.username}</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleInvitationResponse(invitation.id, true)}
                  >
                    <Check className="mr-2 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleInvitationResponse(invitation.id, false)}
                  >
                    <X className="mr-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Aucune demande en attente</p>
        )}
      </CardContent>
    </Card>
  )
}
