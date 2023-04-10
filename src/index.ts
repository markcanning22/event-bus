import express, {Express, Request, Response} from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import axios from 'axios';

type Event = {
    type: string,
    data: []
}

const app: Express = express();
app.use(cors());
app.use(bodyParser.json());

const listeners: string[] = [
    'http://posts-clusterip-srv:4000',
    'http://comments-clusterip-srv:4001',
    'http://query-clusterip-srv:4002',
    'http://moderation-clusterip-srv:4003'
];

const events: Event[] = [];

app.post('/events', async (req: Request, res: Response): Promise<void> => {
    const event: Event = req.body;

    events.push(event);

    console.log('Received event: ' + event.type);

    let listener: string;
    for (listener of listeners) {
        await axios.post(`${listener}/events`, event).catch((err): void => {
            console.log(err.message);
        });
    }

    res.send({ status: 'OK'});
});

app.get('/events', (req: Request, res: Response): void => {
    res.send(events);
});

app.listen(4005, (): void => {
    console.log('Listening on 4005');
});