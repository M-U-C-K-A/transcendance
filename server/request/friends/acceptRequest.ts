import { PrismaClient } from "@prisma/client";
import { id } from "../chat/interface";

const Prisma = new PrismaClient()

export default async function sendFriendRequest(userId: number, friendName: string) {
