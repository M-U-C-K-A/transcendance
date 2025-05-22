// server/request/chat/getMessage.ts
import { PrismaClient } from '@prisma/client'
import { getAvatar } from '@/server/utils/getAvatar'
import { userData } from '@/server/utils/interface'

const Prisma = new PrismaClient()

interface FormattedMessage {
  id: number;
  content: string;
  isGeneral: boolean;
  sendAt: Date;
  sender: {
    id: number;
    username: string;
    avatar: string;
  };
  recipient?: {
    id: number;
    username: string;
    avatar: string;
  };
}

export default async function getMessage(username: string): Promise<FormattedMessage[]> {
  try {
    const messages: any[] = await Prisma.$queryRaw`
      SELECT
        m.id,
        m.content,
        m.isGeneral,
        m.sendAt,
        sender.id as "senderId",
        sender.username as "senderUsername",
        sender.avatar as "senderAvatar",
        recipient.id as "recipientId",
        recipient.username as "recipientUsername",
        recipient.avatar as "recipientAvatar"
      FROM
        "Message" m
      JOIN
        "User" sender ON m.senderId = sender.id
      LEFT JOIN
        "User" recipient ON m.recipientId = recipient.id
      WHERE
        sender.username = ${username}
        OR recipient.username = ${username}
        OR (m.isGeneral = TRUE AND m.recipientId IS NULL)
      ORDER BY
        m.sendAt DESC`;

    const formattedMessages = await Promise.all(messages.map(async (msg) => {
      const senderAvatar = msg.senderAvatar ? await getAvatar({
        id: msg.senderId,
        username: msg.senderUsername,
        avatar: msg.senderAvatar,
        elo: 0,
        bio: '',
        win: 0,
        lose: 0,
      } as userData) : null;

      const recipientAvatar = msg.recipientId && msg.recipientAvatar
        ? await getAvatar({
            id: msg.recipientId,
            username: msg.recipientUsername,
            avatar: msg.recipientAvatar,
            elo: 0,
            bio: '',
            win: 0,
            lose: 0,
          } as userData)
        : undefined;

      return {
        id: msg.id,
        content: msg.content,
        isGeneral: msg.isGeneral,
        sendAt: msg.sendAt,
        sender: {
          id: msg.senderId,
          username: msg.senderUsername,
          avatar: senderAvatar || ''
        },
        recipient: msg.recipientId ? {
          id: msg.recipientId,
          username: msg.recipientUsername,
          avatar: recipientAvatar || ''
        } : undefined
      };
    }));

    return formattedMessages;
  } catch (err) {
    console.error("Error in getMessage:", err);
    throw new Error("Could not retrieve messages");
  }
}

