const jwt = require("jsonwebtoken");

const Register = require("../models/registers");

// let show = document.getElementById('show');

// show1.innerHTML = "jjj";


 global.auth = async (req,res,next)=>{
    try{
      const token = req.cookies.jwt;
      const verifyUser = jwt.verify(token,process.env.SECRET_KEY);
      const user =  await Register.findOne({_id:verifyUser._id});

      // console.log(verifyUser);
      // console.log(user.name);
    

      req.token = token;
      req.user = user;

      next();
    }catch(err){

      
      // console.log(err);
      res.render("login");
      // res.status(401).send(err);
    }

}

module.exports = global.auth;