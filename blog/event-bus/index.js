const express = require ('express');
const axios = require('axios');

const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const events = [];

app.post('/events', async(req, res) => {
    const event = req.body;
    
    events.push(event);

    try {
        await axios.post('http://post-clusterip-srv:4000/events', event);
    } catch (err) {
        console.error('Error sending event to posts service:', err.message);
    }


    try {
        await axios.post('http://comments-srv:4001/events', event);
    } catch (err) {
        console.error('Error sending event to comments service:', err.message);
    }

    try {
        await axios.post('http://query-srv:4002/events', event);
    } catch (err) {
        console.error('Error sending event to moderation service:', err.message);
    }

    try {
        await axios.post('http://moderation-srv:4003/events', event);
    } catch (err) {
        console.error('Error sending event to query service:', err.message);
    }
   


    res.send({status: 'OK'});
});

app.get('/events',(req,res) =>{
    res.send(events);
});
app.listen(4005, () => {
    console.log('Listening on 4005');
});