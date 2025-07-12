    const express = require('express');
    const cors = require('cors');
    const bodyParser = require('body-parser');
    const { NlpManager } = require('node-nlp');

    const app = express();
    const PORT = 8000;

    app.use(cors());
    app.use(bodyParser.json());

    const manager = new NlpManager({ languages: ['en'] });
    manager.load('model.nlp');

    app.post('/chat', async (req, res) => {
    const { message } = req.body;
    const response = await manager.process('en', message);
    res.json({ reply: response.answer || "Sorry, I don't know how to respond to that yet." });
    });

    app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    });
