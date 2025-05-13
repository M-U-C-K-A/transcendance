import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface ProfileData {
  profile: {
    username: string
    id: number
    avatar: string | null
    bio: string | null
    winRate: number
  }
  matchHistory: any[]
  achievements: any[]
}

export async function getProfileData(username: string): Promise<ProfileData> {
  // Récupérer l'utilisateur
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      avatar: true,
      bio: true,
      win: true,
      lose: true,
      matchesAsP1: {
        select: {
          id: true,
          p1Score: true,
          p2Score: true,
          winnerId: true,
          mDate: true
        }
      },
      matchesAsP2: {
        select: {
          id: true,
          p1Score: true,
          p2Score: true,
          winnerId: true,
          mDate: true
        }
      },
      achievements: true
    }
  })

  if (!user) {
    throw new Error('User not found')
  }

  // Calculer le taux de victoire
  const totalGames = user.win + user.lose
  const winRate = totalGames > 0 ? user.win / totalGames : 0

  // Fusionner les matchs
  const allMatches = [...user.matchesAsP1, ...user.matchesAsP2]
    .sort((a, b) => new Date(b.mDate).getTime() - new Date(a.mDate).getTime())

  // Formater l'historique des matchs
  const matchHistory = allMatches.map(match => ({
    id: match.id,
    result: match.winnerId === user.id ? 'Victory' : 'Defeat',
    score: `${match.p1Score}-${match.p2Score}`,
    date: match.mDate
  }))

  // Formater les réalisations
  const achievements = user.achievements ? Object.entries(user.achievements)
    .filter(([_, value]) => value === true)
    .map(([key]) => ({ name: key })) : []

  return {
    profile: {
      username: user.username,
      id: user.id,
      avatar: user.avatar ? `data:image/png;base64,${Buffer.from(user.avatar).toString('base64')}` : '',
      bio: user.bio || '',
      winRate
    },
    matchHistory,
    achievements
  }
}

