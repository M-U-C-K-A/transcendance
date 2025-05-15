import { FastifyInstance } from "fastify"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function statsRoutes(fastify: FastifyInstance) {
  // Liste des utilisateurs
  fastify.get("/stats/users", async (request, reply) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          username: true,
          elo: true
        },
        orderBy: {
          elo: 'desc'
        }
      })
      return users
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error)
      return reply.status(500).send({ error: "Erreur serveur" })
    }
  })

  // Statistiques utilisateur
  fastify.get("/stats/user/:userId", async (request, reply) => {
    try {
      const { userId } = request.params as { userId: string }
      
      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
        include: {
          achievements: true,
          matchesAsP1: true,
          matchesAsP2: true,
          wonMatches: true,
          tournamentWins: true,
        }
      })

      if (!user) {
        return reply.status(404).send({ error: "Utilisateur non trouvé" })
      }

      // Calculer les statistiques avancées
      const totalMatches = user.matchesAsP1.length + user.matchesAsP2.length
      const winRate = totalMatches > 0 ? (user.win / totalMatches) * 100 : 0
      const averageScore = totalMatches > 0 ? user.pointScored / totalMatches : 0
      const averageConceded = totalMatches > 0 ? user.pointConcede / totalMatches : 0

      // Historique des matchs des 6 derniers mois
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

      const recentMatches = await prisma.match.findMany({
        where: {
          OR: [
            { p1Id: parseInt(userId) },
            { p2Id: parseInt(userId) }
          ],
          mDate: {
            gte: sixMonthsAgo
          }
        },
        orderBy: {
          mDate: 'asc'
        }
      })

      // Préparer les données pour le graphique d'évolution de l'elo
      const eloHistory = recentMatches.map(match => ({
        date: match.mDate,
        elo: match.p1Id === parseInt(userId) ? match.p1Elo : match.p2Elo,
        eloGain: match.p1Id === parseInt(userId) ? match.p1EloGain : match.p2EloGain
      }))

      // Statistiques des matchs par type
      const matchTypes = await prisma.match.groupBy({
        by: ['matchType'],
        where: {
          OR: [
            { p1Id: parseInt(userId) },
            { p2Id: parseInt(userId) }
          ]
        },
        _count: {
          matchType: true
        }
      })

      // Statistiques des tournois
      const tournamentData = await prisma.tournament.findMany({
        include: {
          participants: true,
          winner: true
        }
      })

      const tournamentDetails = {
        total: tournamentData.length,
        averageParticipants: tournamentData.reduce((acc, t) => acc + t.participants.length, 0) / tournamentData.length,
        mostWins: tournamentData.reduce((acc, t) => {
          if (t.winnerId) {
            acc[t.winnerId] = (acc[t.winnerId] || 0) + 1
          }
          return acc
        }, {} as Record<number, number>),
        participationByUser: tournamentData.reduce((acc, t) => {
          t.participants.forEach(p => {
            acc[p.userId] = (acc[p.userId] || 0) + 1
          })
          return acc
        }, {} as Record<number, number>)
      }

      // Statistiques des achievements
      const achievementStats = await prisma.achievement.groupBy({
        by: ['id'],
        _count: {
          id: true
        }
      })

      return {
        basicStats: {
          elo: user.elo,
          win: user.win,
          lose: user.lose,
          winRate,
          totalMatches,
          averageScore,
          averageConceded,
          tournamentWins: user.tournamentWon,
          achievements: user.achievements
        },
        eloHistory,
        matchTypes,
        tournamentStats: tournamentDetails,
        achievementStats
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error)
      return reply.status(500).send({ error: "Erreur serveur" })
    }
  })

  // Statistiques globales
  fastify.get("/stats/global", async (request, reply) => {
    try {
      // Top 10 des joueurs par ELO
      const topPlayers = await prisma.user.findMany({
        orderBy: {
          elo: 'desc'
        },
        take: 10,
        select: {
          id: true,
          username: true,
          elo: true,
          win: true,
          lose: true,
          pointScored: true,
          pointConcede: true
        }
      })

      // Statistiques des matchs par type
      const matchTypeStats = await prisma.match.groupBy({
        by: ['matchType'],
        _count: {
          matchType: true
        },
        _avg: {
          p1Score: true,
          p2Score: true
        }
      })

      // Statistiques des tournois
      const tournamentData = await prisma.tournament.findMany({
        include: {
          participants: true,
          winner: true
        }
      })

      const tournamentDetails = {
        total: tournamentData.length,
        averageParticipants: tournamentData.reduce((acc, t) => acc + t.participants.length, 0) / tournamentData.length,
        mostWins: tournamentData.reduce((acc, t) => {
          if (t.winnerId) {
            acc[t.winnerId] = (acc[t.winnerId] || 0) + 1
          }
          return acc
        }, {} as Record<number, number>),
        participationByUser: tournamentData.reduce((acc, t) => {
          t.participants.forEach(p => {
            acc[p.userId] = (acc[p.userId] || 0) + 1
          })
          return acc
        }, {} as Record<number, number>)
      }

      // Distribution des ELO
      const eloRanges = [
        { min: 0, max: 1000, label: "0-1000" },
        { min: 1001, max: 1500, label: "1001-1500" },
        { min: 1501, max: 2000, label: "1501-2000" },
        { min: 2001, max: 2500, label: "2001-2500" },
        { min: 2501, max: 3000, label: "2501-3000" },
        { min: 3001, max: Infinity, label: "3000+" }
      ]

      const eloDistribution = await Promise.all(
        eloRanges.map(async range => {
          const count = await prisma.user.count({
            where: {
              elo: {
                gte: range.min,
                lt: range.max === Infinity ? undefined : range.max
              }
            }
          })
          return {
            range: range.label,
            count
          }
        })
      )

      // Activité par jour de la semaine
      const weeklyActivity = await prisma.match.groupBy({
        by: ['mDate'],
        _count: {
          id: true
        },
        orderBy: {
          mDate: 'asc'
        }
      })

      const daysOfWeek = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
      const activityByDay = weeklyActivity.reduce((acc, match) => {
        const dayIndex = new Date(match.mDate).getDay()
        const day = daysOfWeek[dayIndex]
        acc[day] = (acc[day] || 0) + match._count.id
        return acc
      }, {} as Record<string, number>)

      const maxActivity = Math.max(...Object.values(activityByDay))
      const normalizedActivity = daysOfWeek.map(day => ({
        day,
        activity: ((activityByDay[day] || 0) / maxActivity) * 100
      }))

      // Statistiques des matchs par heure
      const hourlyActivity = await prisma.match.groupBy({
        by: ['mDate'],
        _count: {
          id: true
        }
      })

      const activityByHour = hourlyActivity.reduce((acc, match) => {
        const hour = new Date(match.mDate).getHours()
        acc[hour] = (acc[hour] || 0) + match._count.id
        return acc
      }, {} as Record<number, number>)

      const hourlyStats = Array.from({ length: 24 }, (_, hour) => ({
        hour: `${hour.toString().padStart(2, '0')}:00`,
        count: activityByHour[hour] || 0
      }))

      // Statistiques des scores moyens
      const scoreStats = await prisma.match.aggregate({
        _avg: {
          p1Score: true,
          p2Score: true
        },
        _max: {
          p1Score: true,
          p2Score: true
        },
        _min: {
          p1Score: true,
          p2Score: true
        }
      })

      // Statistiques des achievements
      const achievementStats = await prisma.achievement.groupBy({
        by: ['id'],
        _count: {
          id: true
        }
      })

      return {
        topPlayers,
        matchTypeStats,
        tournamentStats: tournamentDetails,
        eloDistribution,
        weeklyActivity: normalizedActivity,
        hourlyActivity: hourlyStats,
        scoreStats,
        tournamentDetails,
        achievementStats
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques globales:", error)
      return reply.status(500).send({ error: "Erreur serveur" })
    }
  })
} 

