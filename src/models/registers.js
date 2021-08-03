const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        require : true
    },

    email:{
        type: String,
        require : true,
        unique: true
    },
    password:{
        type: String,
        require : true
    },
    confirmpassword:{
        type: String,
        require : true
    },
    tokens:[{
     token:{
        type: String,
        require : true
     }
    }]
});

// generating tokens
employeeSchema.methods.generateAuthToken = async function(){
   try{
    //    console.log(this._id);

      const token = jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
      this.tokens = this.tokens.concat({token});
      await this.save();
    //   console.log(token);
      return token;
   }catch(err){
     res.send("the error part" + err);
      conslog.log("the error part" + err);
   }
}
// converting password into hash 
employeeSchema.pre("save", async function (next){
    if(this.isModified("password")){
    
//  const passowrdHash= await bcrypt.hash(password,10);

//  console.log(`the current passowrd is ${this.password}`);
 this.password =  await bcrypt.hash(this.password,10);
 this.confirmpassword = undefined;

    }

  next();
        
});

const Register = new mongoose.model("Register1",employeeSchema);

module.exports = Register;