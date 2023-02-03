const express = require('express');
const app = express();
const path = require('path');
const PORT = 8800;
const rateLimiter = require('rate-limiter-flexible');
const nodemailer = require('nodemailer');
const validator = require('email-validator');
const bycrypt = require('bcrypt');
const tedious = require('tedious');
const db = require('mssql');
// const connection = require('mssql')
require('dotenv').config();

app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.json())

const config = {
    user:'CloudSAddeb947e',
    password: 'agile-projectG9',
    server: 'agile-project.database.windows.net',
    database: 'agile',
port: 1433
}

app.get('/recipes', (req, res) => {
    db.connect(config, (err) => {
      if (err) {
        console.error('Error connecting to database:', err);
        return res.status(500).send({ error: 'Error connecting to database' });
      }
      console.log('Connected to database');
      //create a new request object
      let sqlRequest = new db.Request();
      //query the database and get the records
      let sqlQuery = 'Select * From Recipes';
      sqlRequest.query(sqlQuery, function(err, data){
        if (err) {
          console.error('Error querying database:', err);
          return res.status(500).send({ error: 'Error querying database' });
        }
        // console.table(data.recordset);
        res.status(200).send(data.recordset);
        // console.log(data);
        db.close();
      });
    });
  });
  //Adding recipes

    app.post('/AddRecipes', (req, res) => {
        const RecipeName = String(req.body.NameOfRecipe);
        const Ingredients = String(req.body.Ingredients);
        const RecipeInstructions = String(req.body.Instructions);
        const RecipeImage = Buffer.from(req.body.Image, 'binary');
        const serving_size = String(req.body.ServingSize);
        const Unit = String(req.body.Unit);
        console.log(RecipeName);
        console.log(RecipeInstructions);

        //convert image to buffer
       
        db.connect(config, (err) => {
            if (err) {
                console.error('Error connecting to database:', err);
                return res.status(500).send({ error: 'Error connecting to database' });

            }
            console.log('Connected to database');

            //create a nw request object
            let sqlRequest = new db.Request();
            //query the database and insert the data
        let sqlQuery = "INSERT INTO Recipes (RecipeName, RecipeInstructions,serving_size,image) VALUES ('" + RecipeName + "', '" + RecipeInstructions + "', '" + serving_size + "', '" + RecipeImage + "')";
        sqlRequest.query(sqlQuery,function(err,data){
            if(err){
                console.error('Error querying database:', err);
                return res.status(500).send({ error: 'Error querying database' });
            }
            else{
                
                console.log('Success');
                //queary the other table in the database
                let sqlQuery = "INSERT INTO Ingredients (IngredientName , IngredientUnit) VALUES ('" + Ingredients + "', '" + Unit + "')";
                sqlRequest.query(sqlQuery,function(err,data){
                    if(err){
                        console.error('Error querying database:', err);
                        return res.status(500).send({ error: 'Error querying database' });
                    }
                    else{
                        console.log('Success');
                        db.close();
                    }
                })

            }
        })


          });
          
        });




app.post('/details', (req,res) =>{
    //receive the product id from the client
    const id = parseInt(req.body.id, 10);
    if(!id){
        console.log('No id provided');
    }
    console.log(id);
    //connect to the database
    db.connect(config, (err) => {
        if (err){
            console.error('Error connecting to database:', err);
            return res.status(500).send({ error: 'Internal server error' });
        }
        console.log('Connected to database');
        //create a new request object
        let sqlRequest = new db.Request();
        //query the database and get the records
        let sqlQuery = "Select * From Recipes Where RecipeID = '" + id + "'";
        sqlRequest.query(sqlQuery, function(err, data){
            if (err) {
                console.error('Error querying database:', err);
                return res.status(500).send({ error: 'Internal server error' });
            }
            else{
                console.log('Success');
                res.status(200).send(data.recordset);
                db.close();
            }
            
        }
        );
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/views/index.ejs'));
});
app.get('/contact.html', (req, res) =>{
    res.sendFile(path.join(__dirname, '/dist/contact.html'));
})
app.get('/dist/css/main.css',(req, res)=>{
    res.sendFile(path.join(__dirname, '/dist/css/main.css'));
});
app.get('/dist/js/app.js',(req, res) =>{
    res.sendFile(path.join(__dirname, 'dist/js/app.js'));
    }
);
app.get('/dist/js/uikit.js',(req, res)=>{
    res.sendFile(path.join(__dirname, '/dist/js/uikit.js'));
});
app.get('/src/js/uikit.js',(req, res) => {
    res.sendFile(path.join(__dirname, '/src/js/uikit.js'));
});
app.get('/src/js/subscribe.js',(req, res) => {
    res.sendFile(path.join(__dirname, '/src/js/subscribe.js'));
});
app.get('/src/js/login.js',(req, res) => {
    res.sendFile(path.join(__dirname, '/src/js/login.js'));
});
app.get('/src/js/index.js',(req, res) => {
    res.sendFile(path.join(__dirname, '/src/js/index.js'));
});
app.get('/src/js/recipe.js',(req, res) => {
    res.sendFile(path.join(__dirname, '/src/js/recipe.js'));
});  
app.get('/src/js/Admin.js',(req, res) => {
    res.sendFile(path.join(__dirname, '/src/js/Admin.js'));
});
app.get('/dist/Admin.html',(req, res) => {
    res.sendFile(path.join(__dirname, '/dist/Admin.html'));
});
app.get('/src/js/Add-Recipe.js',(req, res) => {
    res.sendFile(path.join(__dirname, '/src/js/Add-Recipe.js'));
});
app.get('/dist/Add-recipe.html',(req, res) => {
    res.sendFile(path.join(__dirname, '/dist/Add-recipe.html'));
});
//alow user to send upto 100 messages under an hour
const limiter = new rateLimiter.RateLimiterMemory({
    points: 100,
    duration: 60 * 60
})
app.post('/mail', async (req, res) => {
    const name = String(req.body.name);
    const email = String(req.body._replyto);
    const message = String(req.body.message);
    console.log("Data:", name, email, message);
    try{
        await limiter.consume(req.ip);
        let errName = '';
        let errEmail = '';
        let errMessage = '';
        let err = false;
        if(!name){
            errName = 'Please enter your name.';
            err = true;
        }
        if(!email){
            errEmail = 'Please enter your email.';
            err = true;
        }
        if(!message || message.length < 10){
            errMessage = 'Sorry the message must be atleast 10 characters.';
            err = true;
        }
        if(!validator.validate(email)){
            res.status(400).json({message: 'Bad request', errEmail: 'Please enter a valid email.'});
            err = true;
            return;
        }
        if(err){
            res.status(400).json({message: 'Bad request', errName, errEmail, errMessage});
            return;
        }
        else if(!err){
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.Pass
                }
        });
        let emailOption = {
            from: process.env.EMAIL,
            to: process.env.EMAIL,
            subject: `WebPage Message From ${name}`,
            text: `Email from: ${email}\nMessage: ${message}`,
        };
        transporter.sendMail(emailOption, (err, info) => {
            if(err){
                console.log("error: ", err);
                res.status(500).json({message: 'Internal server error'});
                return;
            }
            else{
                console.log("success: ", info);
                res.status(200).json({message: 'success'});
                return;
        }
    })
}}
    catch(err){
        console.log("catch error: ", err);
        res.status(429).json({message: 'Too many requests'});
        return;
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    }
);
