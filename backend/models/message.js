const mongoose = require('mongoose')

    const msgSchema=new mongoose.Schema({
        p_message:{
            type:String,
            required:true,
        }
        })

    const Message=mongoose.model("pmessages",msgSchema);

    module.exports= Message