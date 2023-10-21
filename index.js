
const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");

const port = process.env.PORT || 7000;
const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl)
.then(()=>console.log("database is connected"))
.catch((error)=>{
    console.log(error);
    process.exit(1);
})

app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static("public"));

const languageSchma = new mongoose.Schema({
    language:{
        type: String,
        required: true
    },
    // subject:{
    //     type:String,
    //     required: true
    // },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
const Language = mongoose.model("languages", languageSchma);


app.get("/", (req,res)=>{
    // res.status(200).send({msg:"welcome to our home page"});
    res.redirect("/register/info");
})

let languages = [];
app.get("/register/info", (req, res)=>{
    res.render("index", {langNme:languages} );
})


app.post("/register", async (req, res)=>{
    const newLanguage = new Language(req.body);
    await newLanguage.save();
    languages.push(newLanguage.language);
    res.redirect("/register/info");
})

app.get("/contact", (req, res)=>{
    res.render("contact", {});
})

app.use((req,res,next)=>{
    res.status(404).send({
        message: "404~Route not found"
    })
})
app.use((err,req,res,next)=>{
    res.status(500).send({
        message: "Something broke!"
    })
})

app.listen(port, ()=>{
    console.log(`Server is connected at http://localhost:${port}`);
})