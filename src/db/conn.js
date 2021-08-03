const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/webResistion1",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
    
}).then(()=>{
    console.log('connect succussful');
}).catch((err)=>{
     console.log(err);
})