import {PrismaClient} from '@prisma/client'
import {connectionData} from '../utils/interface'
import bcrypt from 'bcrypt'

const Prisma = new PrismaClient()

export async function register(data: connectionData) {
    const getRequest = await Prisma.$queryRaw<connectionData[]>`SELECT username, email FROM USER WHERE username == ${data.username}`

    if (getRequest[0].username) {console.log('Username already taken'); throw Error ('Username already taken')}
    if (getRequest[0].email) {console.log ('Email already taken'); throw Error ('Email already taken')}

    const hashedPass = await bcrypt.hash(data.password, 10)

    await Prisma.$executeRaw`INSERT INTO USER (username, email, password) VALUES (${data.username}, ${data.email}, ${hashedPass})`
    console.log(`User ${getRequest[0].username} has been registered`)
}

export async function login(data: connectionData) {
    const getRequest = await Prisma.$queryRaw<connectionData[]>`SELECT email, password FROM USER WHERE email == ${data.email}`

    if (!getRequest[0].email) {console.log('This account does not exist'); throw Error ('This account does not exist')}

    const goodPass = await bcrypt.compare(data.password, getRequest[0].password)

    if (goodPass)
    {
        console.log(`User ${getRequest[0].username} has been logged`)
        return (true)
    }
    else
        {console.log('Wrong password'); throw Error ('Wrong password')}
}