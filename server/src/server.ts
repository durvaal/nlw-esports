import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';

import { convertHourStringToMinutes } from './utils/convert-hour-string-to-minutes';
import { convertMinutesToHourString } from './utils/convert-minutes-to-hour-string';

const app = express();
const prisma = new PrismaClient({
  log: ['query']
});

app.use(express.json());
app.use(cors())

// listagem de games com contagem de anúncios
app.get('/games', async (request: Request, response: Response) => {
  const games = await prisma.game.findMany({
    include: {
      _count: {
        select: {
          ads: true
        }
      }
    }
  });

  return response.json(games);
});

// listagem de anúncio por game
app.get('/games/:id/ads', async (request: Request, response: Response) => {
  const gameId = request.params.id;

  const ads = await prisma.ad.findMany({
    select: {
      id: true,
      name: true,
      yearsPlaying: true,
      weekDays: true,
      hourStart: true,
      hourEnd: true,
      useVoiceChannel: true,
    },
    where: {
      gameId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return response.json(ads.map((ad) => {
    return {
      ...ad,
      weekDays: ad.weekDays.split(','),
      hourStart: convertMinutesToHourString(ad.hourStart),
      hourEnd: convertMinutesToHourString(ad.hourEnd)
    };
  }));
});

// criação de novo anúncio
app.post('/games/:id/ads', async (request: Request, response: Response) => {
  const gameId = request.params.id;
  const body = request.body; // validar com zod javascript

  const ad = await prisma.ad.create({
    data: {
      gameId,
      ...body,
      weekDays: body.weekDays.join(','),
      hourStart: convertHourStringToMinutes(body.hourStart),
      hourEnd: convertHourStringToMinutes(body.hourEnd)
    }
  });

  const game = await prisma.game.findUniqueOrThrow({
    select: {
      title: true,
    },
    where: {
      id: ad.gameId,
    }
  });

  await axios.post('https://exp.host/--/api/v2/push/send', {
    to: 'ExponentPushToken[0jkpe7OuQUcg5mBQN8IwzT]',
    title: `Confira o novo anúncio`,
    body: `O usuário '${ad.name}' está buscando um Duo para '${game.title}'`
  });

  console.info('[EXPO] Send notification to device');

  return response.status(200).json(ad);
});

// buscar discord pelo ID do anúncio
app.get('/ads/:id/discord', async (request: Request, response: Response) => {
  const adId = request.params.id;

  const ad = await prisma.ad.findUniqueOrThrow({
    select: {
      discord: true,
    },
    where: {
      id: adId,
    }
  });

  return response.json({
    discord: ad.discord
  });
});

app.listen(3000);
