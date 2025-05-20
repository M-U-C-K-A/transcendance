import { FastifyInstance } from 'fastify';
import { registerSchema, loginSchema } from '../schemas/auth';
import { PrismaClient } from '@prisma/client';
import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function authRoutes(fastify: FastifyInstance) {
  // Route d'inscription
  fastify.post('/register', async (request, reply) => {
    try {
      const { email, password, username } = registerSchema.parse(request.body);
      
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email },
            { username }
          ]
        }
      });

      if (existingUser) {
        return reply.status(400).send({
          message: 'Un utilisateur avec cet email ou ce nom d\'utilisateur existe déjà'
        });
      }

      // Hasher le mot de passe
      const hashedPassword = await hash(password, 10);

      // Créer l'utilisateur
      const user = await prisma.user.create({
        data: {
          email,
          username,
          pass: hashedPassword,
        }
      });

      // Générer le token JWT
      const token = sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'votre_secret_jwt',
        { expiresIn: '24h' }
      );

      return reply.status(201).send({
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username
        }
      });
    } catch (error) {
      return reply.status(400).send({ message: 'Erreur lors de l\'inscription' });
    }
  });

  // Route de connexion
  fastify.post('/login', async (request, reply) => {
    try {
      const { email, password } = loginSchema.parse(request.body);

      // Trouver l'utilisateur
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return reply.status(401).send({
          message: 'Email ou mot de passe incorrect'
        });
      }

      // Vérifier le mot de passe
      const validPassword = await compare(password, user.pass);

      if (!validPassword) {
        return reply.status(401).send({
          message: 'Email ou mot de passe incorrect'
        });
      }

      // Générer le token JWT
      const token = sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'votre_secret_jwt',
        { expiresIn: '24h' }
      );

      return reply.send({
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username
        }
      });
    } catch (error) {
      return reply.status(400).send({ message: 'Erreur lors de la connexion' });
    }
  });

  // Route pour l'authentification Google
  fastify.post('/auth/google', async (request, reply) => {
    try {
      const { token } = request.body as { token: string };
      
      // TODO: Implémenter la vérification du token Google
      // TODO: Créer ou mettre à jour l'utilisateur avec les informations Google
      
      return reply.status(501).send({ message: 'Non implémenté' });
    } catch (error) {
      return reply.status(400).send({ message: 'Erreur lors de l\'authentification Google' });
    }
  });
} 
