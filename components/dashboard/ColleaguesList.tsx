import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Users } from "lucide-react"
import Link from "next/link"
import { useI18n } from "@/i18n-client"
import { useEffect, useState } from "react"

interface Friend {
  username: string;
  status: 'online' | 'offline';
  avatar?: string;
}

export function ColleaguesList({ user, locale }: { user: string; locale: string }) {
  const t = useI18n()

  const [friends, setFriends] = useState<Friend[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFriends = async () => {
      try
      {
        setLoading(true)
        const response = await fetch(`/api/friends/${user}`)
        if (!response.ok) {
          throw new Error('Failed to fetch friends')
        }
        const data = await response.json()
        setFriends(data)
      }
      catch (err) 
      {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } 
      finally 
      {
        setLoading(false)
      }
    }

    fetchFriends()
  }, [user])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <Card className="bg-card border shadow-sm mt-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-5 w-5" /> {t('dashboard.colleagues.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {friends.length > 0 ? (
            friends.map((friend, index) => (
              <Link key={index} href={`/${locale}/profile/${friend.username}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage
                        src={friend.avatar || `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${friend.username}`}
                        alt={friend.username}
                      />
                      <AvatarFallback>{friend.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{friend.username}</p>
                      <p className="text-xs text-muted-foreground">
                        {friend.status === 'online'
                          ? t('dashboard.colleagues.online')
                          : t('dashboard.colleagues.offline')}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label={`${t('dashboard.colleagues.message')} ${friend.username}`}>
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">{t('dashboard.colleagues.noFriends')}</p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" aria-label={t('dashboard.colleagues.add')}>
          {t('dashboard.colleagues.add')}
        </Button>
      </CardFooter>
    </Card>
  )
}
