"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner' // Import de Sonner

export default function InvitationPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [hostData, setHostData] = useState<{
    name: string
    id: string
    image?: string
  } | null>(null)

  useEffect(() => {
    const joinGame = async () => {
      try {
		const token = localStorage.getItem("token");

        if (!token) {
          router.push('/auth')
          return
        }

        const response = await fetch('/api/game/travel', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
			'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            code: params.slug,
          }),
        })

        if (!response.ok) {
          throw new Error('Échec de la requête')
        }

        const data = await response.json()

        if (data.success) {
          toast.success('Vous avez rejoint la partie avec succès !') // Toast de succès
          setHostData({
            name: data.hostName,
            id: data.hostId,
            image: data.hostImage
          })
        } else {
          throw new Error('Invitation invalide')
        }
      } catch (err) {
        console.error(err)
        setError(true)
        toast.error('Impossible de rejoindre la partie') // Toast d'erreur
      } finally {
        setLoading(false)
      }
    }

    joinGame()
  }, [params.slug, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">
              <Skeleton className="h-6 w-[200px] mx-auto" />
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Skeleton className="w-24 h-24 rounded-full" />
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </CardContent>
          <CardFooter className="flex justify-center">
            <Skeleton className="h-10 w-[150px]" />
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (error || !hostData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Erreur</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p>Impossible de rejoindre cette partie</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => router.push('/')}>
              Retour à l'accueil
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Invitation acceptée</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <Avatar className="w-24 h-24">
            {hostData.image ? (
              <AvatarImage src={hostData.image} alt={`Photo de ${hostData.name}`} />
            ) : (
              <AvatarFallback>
                {hostData.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            )}
          </Avatar>

          <p className="text-center text-lg">
            Vous avez rejoint la partie de <span className="font-semibold">{hostData.name}</span>
          </p>

          <p className="text-center text-sm text-gray-500">
            ID de l'hôte: {hostData.id}
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            onClick={() => router.push('/')}
            className="bg-primary hover:bg-primary-dark"
          >
            Retour à l'accueil
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
