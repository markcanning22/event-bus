import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = new express();
app.use(cors());
app.use(bodyParser.json());

const listeners = [
    'http://localhost:4000/',
    'http://localhost:4001/',
    'http://localhost:4002/'
];

app.post('/events', async (req, res) => {
    const event = req.body;

    console.log('Received event: ' + event.type);

    for (const listener of listeners) {
        await axios.post(`${listener}/events`, event).catch((err) => {
            console.log(err.message);
        });
    }

    res.send({ status: 'OK'});
});

app.listen(4005, () => {
    console.log('Listening on 4005');
});