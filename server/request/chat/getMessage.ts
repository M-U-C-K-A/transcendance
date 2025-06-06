// server/request/chat/getMessage.ts
import { PrismaClient } from '@prisma/client'

const Prisma = new PrismaClient()

export default async function getMessage(username: string) {
    const messages = await Prisma.$queryRaw<any[]>`
    WITH 
    -- 100 derniers messages publics (triés du plus récent au plus ancien)
    latest_public_messages AS (
        SELECT
            m.id,
            m."content",
            m."sendAt",
            m."readStatus",
            m."isGeneral",
            m."messageType",
            sender.id AS sender_id,
            sender.username AS sender_username,
            sender.win AS sender_win,
            sender.lose AS sender_lose,
            sender.elo AS sender_elo,
            NULL AS recipient_id,
            NULL AS recipient_username,
            NULL AS recipient_win,
            NULL AS recipient_lose,
            NULL AS recipient_elo
        FROM "Message" m
        JOIN "User" sender ON sender.id = m."senderId"
        WHERE m."isGeneral" = TRUE
        ORDER BY m."sendAt" DESC
        LIMIT 100
    ),
    
    -- Tous les messages privés concernant l'utilisateur (sans limite)
    all_private_messages AS (
        SELECT
            m.id,
            m."content",
            m."sendAt",
            m."readStatus",
            m."isGeneral",
            m."messageType",
            sender.id AS sender_id,
            sender.username AS sender_username,
            sender.win AS sender_win,
            sender.lose AS sender_lose,
            sender.elo AS sender_elo,
            recipient.id AS recipient_id,
            recipient.username AS recipient_username,
            recipient.win AS recipient_win,
            recipient.lose AS recipient_lose,
            recipient.elo AS recipient_elo
        FROM "Message" m
        JOIN "User" sender ON sender.id = m."senderId"
        LEFT JOIN "User" recipient ON recipient.id = m."recipientId"
        JOIN "User" current_user ON current_user.username = ${username}
        WHERE m."isGeneral" = FALSE
        AND (m."senderId" = current_user.id OR m."recipientId" = current_user.id)
    )
    
    -- Combinaison des résultats avec tri chronologique
    SELECT * FROM (
        SELECT * FROM latest_public_messages
        UNION ALL
        SELECT * FROM all_private_messages
    ) combined_messages
    ORDER BY "sendAt" ASC`;
    
    return messages;
}

