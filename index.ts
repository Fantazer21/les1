import * as express from 'express';
import { Express, Request, Response } from 'express';

const app: Express = express.default();
const port: number = 3000;



app.get('/', (req: Request, res: Response) => {
    res.send('dsadsadsa');
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});
