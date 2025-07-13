    const express = require('express');
    const cors = require('cors');
    const bodyParser = require('body-parser');
    const { NlpManager } = require('node-nlp');
    const mongoose = require('mongoose');
    const Message=require('./models/message.js')
    require('dotenv').config();
    

    const app = express();
    const PORT = 8000;

    app.use(cors());
    app.use(bodyParser.json());

    const manager = new NlpManager({ languages: ['en'] });
    manager.load('model.nlp');

    mongoose.connect(process.env.MONGODB_URI, {
        }).then(() => {
            console.log("✅ MongoDB connected successfully");
        }).catch(err => {
            console.error("❌ MongoDB connection error:", err);
        });

    app.get('/',(req,res)=>{
        res.send('Server Is Active')
    })

    app.post('/chat', async (req, res) => {
    const { message } = req.body;
    if(message ===process.env.Passkey){
        const allMessage=await Message.find({});
        res.json({ reply: allMessage[0].p_message || "Sorry, Something went Wrong ! " });
    }
    else{
    const response = await manager.process('en', message);
    res.json({ reply: response.answer || "Sorry, I don't know how to respond to that yet." });
    }

    });

    app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    });
