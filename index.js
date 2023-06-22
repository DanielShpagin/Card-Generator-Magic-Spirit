const express = require('express');
const app = express();
const openai = require('openai');
const fs = require('fs');
const http = require('http');
const bodyParser = require('body-parser');
const server = http.createServer(app);
const port = 6435;

const configuration = new openai.Configuration({
    apiKey: "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",
});

const ai = new openai.OpenAIApi(configuration);

app.use(bodyParser.json());

app.get('/get_cards', (req, res) => {
    var array = [];

    var cards_folder = fs.readdirSync('./cards');

    cards_folder.forEach(item => {
        /*const files = fs.readdirSync(`./cards/${item}/`);

        files.forEach(file => {
            if (file.endsWith('.json')) {
                const data = fs.readFileSync(`./cards/${item}/${file}`, 'utf-8');
                const parsedData = JSON.parse(data);
                obj.card = parsedData;
            }

            if (file.endsWith('.html')) {
                const data = fs.readFileSync(`./cards/${item}/${file}`, 'utf-8');
                obj.html = data;
            }
        });*/

        array.push(item);
    });

    res.send(JSON.stringify(array));
});

app.post('/get_card', (req, res) => {
    var value = req.body.value;
    var card_folder = fs.readdirSync(`./cards/${value}`);
    var obj = {};

    card_folder.forEach(file => {
        if (file.endsWith('.json')) {
            const data = fs.readFileSync(`./cards/${value}/${file}`, 'utf-8');
            const parsedData = JSON.parse(data);
            obj = parsedData;
        }
    });

    res.send(JSON.stringify(obj));
});

app.post('/create_card', (req, res) => {
    console.log(req.body.value);
    var value = req.body.value;

    if (value) {
        try {
            var data = {};
            data.name = value;

            fs.mkdirSync(`./cards/${value}`, { recursive: true });
            fs.writeFileSync(`./cards/${value}/${value}.json`, JSON.stringify(data), 'utf8');

            res.send(data);
        } catch (err) {
            console.error(err);
        }
    }
});

app.post('/generate-image', async (req, res) => {
    console.log(req.body.value);

    try {
        var response = await ai.createImage({
            prompt: req.body.value, 
            model: 'image-alpha-001', 
            size: "256x256"
        });

        if (response.data && response.data.data && response.data.data.length > 0) {
            res.send(response.data.data[0].url);
        } else res.send(JSON.stringify(response, null, " "));
    } catch (error) {
        /*if (error.response && error.response.data.error.message) {
            res.send("Unable to generate!<br>" + error.response.data.error.message);
        } else res.send("Unable to generate!");*/
    }
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

server.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}`);
});

app.use('/scripts', express.static('scripts'));
app.use('/css', express.static('css'));
app.use('/images', express.static('images'));
app.use('/fonts', express.static('fonts'));