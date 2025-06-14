import { notFound, redirect } from 'next/navigation'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

// Schéma de validation pour la réponse API
const InvitationResponseSchema = z.object({
  success: z.boolean(),
  hostName: z.string(),
  hostId: z.string(),
  hostImage: z.string().optional(),
  gameId: z.string()
})

type InvitationResponse = z.infer<typeof InvitationResponseSchema>

async function fetchInvitationDetails(inviteCode: string, token: string): Promise<InvitationResponse> {
  const response = await fetch(`/api/game/travel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inviteCode,
        token
      }),
  })

  if (!response.ok) {
    throw new Error('Failed to fetch invitation details')
  }

  const data = await response.json()
  return InvitationResponseSchema.parse(data)
}

export default async function InvitationPage({ params }: { params: { slug: string } }) {
  const token = await localStorage.getItem("token")

  if (!token) {
    redirect('/auth')
  }

  let invitationData: InvitationResponse
  try {
    invitationData = await fetchInvitationDetails(params.slug, token)
  } catch (error) {
    console.error('Error fetching invitation:', error)
    notFound()
  }

  if (!invitationData.success) {
    notFound()
  }

  const { hostName, hostId, hostImage } = invitationData

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Invitation acceptée</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <Avatar className="w-24 h-24">
            {hostImage ? (
              <AvatarImage src={hostImage} alt={`Photo de ${hostName}`} />
            ) : (
              <AvatarFallback>
                {hostName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            )}
          </Avatar>

          <p className="text-center text-lg">
            Vous avez rejoint la partie de <span className="font-semibold">{hostName}</span>
          </p>

          <p className="text-center text-sm text-gray-500">
            ID de l'hôte: {hostId}
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            onClick={() => window.location.href = '/'}
            className="bg-primary hover:bg-primary-dark"
          >
            Retour à l'accueil
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
