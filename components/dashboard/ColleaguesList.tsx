// Importation des composants UI personnalisés
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Importation des icônes utilisées dans le composant
import { MessageCircle, Users } from "lucide-react"

// Importation de Link pour la navigation côté client avec Next.js
import Link from "next/link"

// Hook de traduction pour la gestion de l'internationalisation
import { useI18n } from "@/i18n-client"

// Hooks React pour gérer l'état et les effets de bord
import { useEffect, useState } from "react"

// Définition du type d'objet représentant un collègue
interface Friend {
  username: string;
  status: 'online' | 'offline';
  avatar?: string; // optionnel
}

// Définition du composant principal qui affiche la liste des collègues
export function ColleaguesList({ user, locale }: { user: string; locale: string }) {
  // Initialisation du hook de traduction
  const t = useI18n()

  // État pour stocker la liste des collègues
  const [friends, setFriends] = useState<Friend[]>([])
  // État pour suivre si les données sont en cours de chargement
  const [loading, setLoading] = useState(true)
  // État pour stocker une éventuelle erreur
  const [error, setError] = useState<string | null>(null)

  // useEffect pour déclencher la récupération des collègues à l'affichage du composant
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setLoading(true) // indique que le chargement commence
        const response = await fetch(`/api/friends/${user}`) // appel API pour récupérer les collègues
        if (!response.ok) {
          throw new Error('Failed to fetch friends') // gestion d'erreur si la réponse est mauvaise
        }
        const data = await response.json() // transformation de la réponse en JSON
        setFriends(data) // mise à jour de l'état avec les données reçues
      } catch (err) {
        // en cas d'erreur, on met à jour l'état d'erreur
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false) // le chargement est terminé, quel que soit le résultat
      }
    }

    fetchFriends() // exécution de la fonction de récupération
  }, [user]) // se déclenche à chaque fois que l'utilisateur change

  // Affichage d'un message de chargement
  if (loading) {
    return <div>Loading...</div>
  }

  // Affichage d'un message d'erreur si l'appel API a échoué
  if (error) {
    return <div>Error: {error}</div>
  }

  // Rendu principal du composant une fois les données chargées
  return (
    <Card className="bg-card border shadow-sm mt-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-5 w-5" /> {t('dashboard.colleagues.title')} {/* Titre avec icône et traduction */}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Si des collègues existent, on les affiche un par un */}
          {friends.length > 0 ? (
            friends.map((friend, index) => (
              <Link key={index} href={`/${locale}/profile/${friend.username}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {/* Affichage de l'avatar */}
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage
                        src={friend.avatar || `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${friend.username}`} // avatar personnalisé ou généré
                        alt={friend.username}
                      />
                      <AvatarFallback>{friend.username.slice(0, 2).toUpperCase()}</AvatarFallback> {/* Initiales si image indisponible */}
                    </Avatar>
                    <div>
                      {/* Nom d'utilisateur */}
                      <p className="text-sm font-medium">{friend.username}</p>
                      {/* Statut (en ligne / hors ligne) */}
                      <p className="text-xs text-muted-foreground">
                        {friend.status === 'online'
                          ? t('dashboard.colleagues.online')
                          : t('dashboard.colleagues.offline')}
                      </p>
                    </div>
                  </div>
                  {/* Bouton pour envoyer un message */}
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label={`${t('dashboard.colleagues.message')} ${friend.username}`}>
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </Link>
            ))
          ) : (
            // Message s’il n’y a aucun collègue
            <p className="text-sm text-muted-foreground">{t('dashboard.colleagues.noFriends')}</p>
          )}
        </div>
      </CardContent>
      {/* Bouton en bas pour ajouter un collègue */}
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" aria-label={t('dashboard.colleagues.add')}>
          {t('dashboard.colleagues.add')}
        </Button>
      </CardFooter>
    </Card>
  )
}
