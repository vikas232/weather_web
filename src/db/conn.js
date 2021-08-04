const mongoose = require("mongoose");

mongoose.connect("MONGO_URL",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
    
}).then(()=>{
    console.log('connect succussful');
}).catch((err)=>{
     console.log(err);
})