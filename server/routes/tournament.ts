import { FastifyInstance } from 'fastify';
import { createTournament } from '../request/tournament/createTournament';
import { joinTournament } from '../request/tournament/joinTournament';

export default async function tournamentRoutes(server: FastifyInstance)
{



  server.post('/tournament/create', async (request, reply) =>
  {
      try
      {
        const { hostUsername, tournamentName, slotCount } = request.body;
        const result = await createTournament(hostUsername, tournamentName, slotCount);
        return reply.code(201).send(result);
      }
      catch (err: any)
      {
        request.log.error(err);
        return reply.code(500).send({ error: err.message || 'Error creating tournament' });
      }
  });





  server.post('/tournament/join', async (request, reply) =>
  {
      try
      {
        const { username, tournamentName } = request.body;
        await joinTournament(username, tournamentName);
        return reply.code(200).send({ success: true });
      }
      catch (err: any)
      {
        request.log.error(err);
        return reply.code(500).send({ error: err.message || 'Error joining tournament' });
      }
  });

}
