"use client"
import { useEffect, useState } from 'react'
import { use } from 'react'

type ProfileData = {
  profile: {
    username: string
    id: string
    avatar: string
    bio: string
    winRate: number
  }
  matchHistory: any[]
  achievements: any[]
}

type Props = {
  params: Promise<{
    username: string
  }>
}

export default function ProfilePage({ params: paramsPromise }: Props) {
  const params = use(paramsPromise)
  const { username } = params
  const [profileData, setProfileData] = useState<ProfileData | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Effectuer la requête pour récupérer le profil depuis le serveur Fastify
        const response = await fetch(`http://localhost:3001/profile/${username}`)
        const data = await response.json()
        setProfileData(data)
      } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error)
      }
    }

    fetchProfile()
  }, [username])

  if (!profileData) {
    return <div>Chargement...</div>
  }

  const { profile, matchHistory, achievements } = profileData

  return (
    <div>
      <h1>Profil de {profile.username}</h1>
      <p>ID utilisateur : {profile.id}</p>
      <p>Bio : {profile.bio}</p>
      <p>Taux de victoire : {profile.winRate ? `${(profile.winRate * 100).toFixed(2)}%` : 'N/A'}</p>
      <img
        src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${profile.username}`}
        width="100"
        alt={`${profile.username}'s avatar`}
      />

      <h2>Historique des matchs</h2>
      {matchHistory.length === 0 ? (
        <p>Aucun historique de match</p>
      ) : (
        <ul>
          {matchHistory.map((match, index) => (
            <li key={index}>{`Match ${match.id} - ${match.result}`}</li>
          ))}
        </ul>
      )}

      <h2>Réalisations</h2>
      {achievements.length === 0 ? (
        <p>Aucune réalisation</p>
      ) : (
        <ul>
          {achievements.map((achievement, index) => (
            <li key={index}>{achievement.name}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

