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
const Buffer = require('buffer').Buffer;
const sharp = require('sharp');
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
        const Recipes = data.recordset.map(async recipe=>{
            const resizedImage = await sharp(recipe.image).resize(300,160).toBuffer();
            recipe.image = Buffer.from(resizedImage).toString('base64');
            return recipe;
        })
        Promise.all(Recipes)
        .then(Recipes => {
            console.log(Recipes)
            res.status(200).send(Recipes);
            db.close();
        })
        .catch(err => {
            console.error('Error querying database:', err);
            return res.status(500).send({ error: 'Error querying database' });
        });
      });
    });
  });

app.post('/details', (req,res) =>{
    //receive the product id from the client
    const id = parseInt(req.body.id, 10);
    if(!id){
        console.log('No id provided');
    }
    console.log(id);
    getRecipeDetails(id, res);
});


    
        //query the database and get the records
        async function getRecipeDetails(id, res){
            try {
                await db.connect(config);
                console.log('Connected to database');
                //create a new request object
                let sqlRequest = new db.Request();

                let sqlQuery = "Select * From Recipes Where RecipeID = '" + id + "'";
                const recipeData = await sqlRequest.query(sqlQuery);
                const Recipes = recipeData.recordset.map(async recipe=>{
                    const resizedImage = await sharp(recipe.image).resize(600,600).toBuffer();
                    recipe.image = Buffer.from(resizedImage).toString('base64');
                    return recipe;
                })
                const recipeDataEdited = await Promise.all(Recipes)
                let sqlQuery2 = "Select * From RecipeIngredients Where RecipeID = '" + id + "'";
                const ingredientData = await sqlRequest.query(sqlQuery2);
                const Ingredients = ingredientData.recordset

                const ingredientPromises = Ingredients.map(async item=>{
                    const ingredientIDs = item.IngredientID;
                    let sqlQuery3 = "Select * From Ingredients Where IngredientID = '" + ingredientIDs + "'";
                    const ingredientDetails = await sqlRequest.query(sqlQuery3);
                    return ingredientDetails.recordset;
                });
                const ingredientDetails = await Promise.all(ingredientPromises);
                const results ={
                    recipeData: recipeDataEdited,
                    ingredientDetails
                };
                console.log(results);
                return res.status(200).send(results);
            
        }
            catch(err){
                console.error('Error querying database:', err);
                return res.status(500).send({ error: 'Internal server error' });
            }
        }






















// //connect to the database
// db.connect (config, (err) => {
//     if (err){
//     console.error('Error connecting to database:', err);
//     return res.status(500).send({ error: 'Internal server error' });
//       }
//    console.log('Connected to database');
//    //create a new request object
//    let sqlRequest = new db.Request();

        // let sqlQuery = "Select * From Recipes Where RecipeID = '" + id + "'";
        // sqlRequest.query(sqlQuery, function(err, data){
        //     if (err) {
        //         console.error('Error querying database:', err);
        //         return res.status(500).send({ error: 'Internal server error' });
        //     }
        //     const Recipes = data.recordset.map(async recipe=>{
        //         const resizedImage = await sharp(recipe.image).resize(600,600).toBuffer();
        //         recipe.image = Buffer.from(resizedImage).toString('base64');
        //         return recipe;
        //     })
        //     Promise.all(Recipes)
        //     .then(Recipes => {
        //         let sqlQuery2 = "Select * From RecipeIngredients Where RecipeID = '" + id + "'";
        //         sqlRequest.query(sqlQuery2, function(err, data){
        //             if (err) {
        //                 console.error('Error querying database:', err);
        //                 return res.status(500).send({ error: 'Internal server error' });
        //             }
        //             const Ingredients = data.recordset
        //             Ingredients.forEach(item =>{
        //                 const ingredientIDs = item.IngredientID;
        //                 console.log(ingredientIDs);
        //                 let sqlQuery3 = "Select * From Ingredients Where IngredientID = '" + ingredientIDs + "'";
        //                 sqlRequest.query(sqlQuery3, function(err, data){
        //                     if (err) {
        //                         console.error('Error querying database:', err);
        //                         return res.status(500).send({ error: 'Internal server error' });
        //                     }
        //                     const result = {
        //                         recipe: Recipes,
        //                         ingredients: data.recordset
        //                     }
        //                     while(!ingredientIDs){
        //                         responseSent = true;
        //                         return res.status(200).send(result);
        //                     }
        //                     if (responseSent){
        //                         return;
                                
        //                     } 
        //                         console.log("#########################################################################");
        //                         console.log(result);
        //                 })

        //             })
        //         })
        //     });
        // }); 
// });
// });

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
