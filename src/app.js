require('dotenv').config();
const express = require("express")
const path = require("path");
const app = express();
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const cookiePaser = require("cookie-parser");




require("./db/conn");
const Register = require("./models/registers")
const auth = require("./middleware/auth")
const port = process.env.PORT || 4000 ;




 const static_path = path.join(__dirname,"../public");
 const template_path = path.join(__dirname,"../template/views");
 const partials_path = path.join(__dirname,"../template/partials");

app.use(express.static(static_path));
app.set("view engine","hbs");
app.set("views",template_path );


// console.log(process.env.SECRET_KEY);

app.use(express.json());

app.use(cookiePaser());
app.use(express.urlencoded({extended:false})); 

hbs.registerPartials(partials_path);

app.get("/",(req,res)=>{
   res.render("index");
})

app.get('/about', auth,(req,res) =>{
  res.render('about');
});
app.get('/weather',(req,res) =>{
  res.render('weather');
});



app.get("/secret",auth,(req,res)=>{
  // console.log(` this a cookie ${req.cookies.jwt}`);
  res.render("secret");
})

app.get("/logout",auth,async(req,res)=>{
  try{
    // console.log(req.user);

    // for single logout :

    // req.user.tokens = req.user.tokens.filter((currElement)=>{
    //   return currElement.token !== req.token
    // });

    //log out form all devices 

    req.user.tokens = [];

    res.clearCookie("jwt");



   console.log("logout Successfull");
    await req.user.save();
    res.render("login");
  }catch(err){
    res.status(501).send(err);
  }
})




app.get("/login",(req,res)=>{
  res.render("login");
})
app.get("/register",(req,res)=>{
  res.render("register");
});



 app.post("/register", async (req,res)=>{
    try{
      const password = req.body.pass;
      const cpassword = req.body.re_pass;
      if(password === cpassword){
        const registerEmp = new Register({
            name:req.body.name,
            email: req.body.email,
            password:req.body.pass,
            confirmpassword:req.body.re_pass

        })
        // console.log("the success part " + registerEmp);
        const token = await registerEmp.generateAuthToken();
        // console.log("the token part" + token);

        // res.cookie(name,value,[options])
        
        res.cookie("jwt",token,{
         expires: new Date(Date.now() + 600000),
         httpOnly:true
        });

        // console.log(cookie);


        // middleware
        const registered = await registerEmp.save();
        res.status(201).render("login");
      }else{
     
          res.send("Password  is not matching");
      }
    //   console.log(req.body.name);
    //   res.send(req.body.name)

    }catch(err){
        res.status(400).send(err);
        console.log(`the error part page :  ${err}`);
    
    }
 })
//  ChOvGJbwhJBN20zGW7PvFFqodWnhW4uIGiR70
 app.post("/login", async (req,res)=>{
    try{ 
      const email = req.body.email;
      const password = req.body.your_pass;
       const useremail =  await Register.findOne({email:email});
       const isMatch = await bcrypt.compare(password,useremail.password);

       const token = await useremail.generateAuthToken();
        console.log("the token part" + token);

        res.cookie("jwt",token,{
          expires: new Date(Date.now() + 600000),
          httpOnly:true
          // secure:true
         });

        //  console.log(` this a cookie ${req.cookies.jwt}`);

      //  console.log(isMatch);

       if(isMatch){
         res.status(201).render("index");
       }else{
         res.send("invalid login Deatails");
       }
    

      //  console.log(useremail);

    //   console.log(` email : ${email} and Password: ${password}`);

    }catch(err){
        res.status(400).send("invalid login Deatails");
    
    }

   

 })



 app.get('*',(req,res) =>{
  res.render('404error',{
      errorMsg:'Opps! Page Not Found'
  })
});

app.listen(port,()=>{
    console.log(`server in running in PORT : ${port} `);
})