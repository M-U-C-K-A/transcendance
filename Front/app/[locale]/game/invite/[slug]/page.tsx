"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

export default function InvitationPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [joinInfo, setJoinInfo] = useState<{
    matchId: number;
    p2Id: number;
    p2Username: string;
    hostId: number;
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
          },
          credentials: "include",
          body: JSON.stringify({
            code: params.slug,
          }),
        })
        if (!response.ok) {
          throw new Error('Échec de la requête')
        }
        const data = await response.json()
        if (data.result && data.result.hostId && data.result.p2Username) {
          toast.success('Vous avez rejoint la partie avec succès !')
          setJoinInfo(data.result)
        } else {
          throw new Error('Invitation invalide')
        }
      } catch (err) {
        console.error(err)
        setError(true)
        toast.error('Impossible de rejoindre la partie')
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

  if (error || !joinInfo) {
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
            <Button onClick={() => router.push('/')}>Retour à l'accueil</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Récupère le paramètre locale depuis l'URL
  const locale = typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : 'fr';

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Invitation acceptée</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={`/profilepicture/${joinInfo.hostId}.webp`} alt={`Photo de l'hôte`} />
            <AvatarFallback>
              {joinInfo.hostId}
            </AvatarFallback>
          </Avatar>
          <p className="text-center text-lg">
            <span className="font-semibold">{joinInfo.p2Username}</span>, tu as bien rejoint la partie !
          </p>
          <p className="text-center text-sm text-gray-500">
            Hôte de la partie : <span className="font-semibold">{joinInfo.hostId}</span>
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            onClick={() => router.push(`/${locale}/dashboard`)}
            className="bg-primary hover:bg-primary-dark"
          >
            Retour au dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
