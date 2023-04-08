import express, {Request, Response} from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const listeners: string[] = [
    'http://localhost:4000',
    'http://localhost:4001',
    'http://localhost:4002',
    'http://localhost:4003'
];

app.post('/events', async (req: Request, res: Response): Promise<void> => {
    const event = req.body;

    console.log('Received event: ' + event.type);

    let listener: string;
    for (listener of listeners) {
        await axios.post(`${listener}/events`, event).catch((err): void => {
            console.log(err.message);
        });
    }

    res.send({ status: 'OK'});
});

app.listen(4005, (): void => {
    console.log('Listening on 4005');
});