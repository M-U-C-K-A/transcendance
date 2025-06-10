import 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
	user: {
	  id: number;
	  pass: number;
	  username: string;
	  email: string;
	  bio: string;
	};
  }
}
