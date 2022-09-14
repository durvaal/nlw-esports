import express, { Request, Response } from 'express';

const app = express();

app.get('/ads', (request: Request, response: Response) => {
  response.send('adss');
});

app.listen(3000);
