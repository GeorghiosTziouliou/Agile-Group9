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

//connnect to the database
// const connection = new tedious.Connection({
//     server:'agile-project.database.windows.net',
//     options:{
//         database: 'agile',
//         encrypt: true,
//         username: 'CloudSAddeb947e',
//         password: 'agile-projectG9',
//         port: 1433
//     }
// })
// connection.on('connect', (err) => {
//     if (err) {
//         console.error('Error connecting to database:', err);
//         return res.status(500).send({ error: 'Internal server error' });
//     }else{
//         console.log('Connected to database');
//         return res.status(200).send({ message: 'Connected to database' });
//     }
// });
// //ejs
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, '/views'));

// app.post('/login', (req, res) => {
//     const username = String(req.body.floatingInput);
//     const password = String(req.body.floatingPassword);
//     console.log('data: ',username, password);
//     //execute a query to retrive the user with given email
//     const query = "SELECT * FROM Users WHERE email = '" + username + "'";
//     const request = new tedious.Request(query, (err, rowCount, rows) => {
//         if (err) {
//             console.log('Error executing query: ');
//             console.error('Error executing query: ',err.message);
//             return res.status(500).send({ message: 'Internal server error' });
//         }
//         //check if a user was found with the given email
//         if (rowCount === 0) {
//             return res.status(401).send({ message: 'Invalid username or password' });
//         }
//       // Compare the hashed password with the one in the database
//     const hashedPassword = rows[0][0].value;
//     bycrypt.compare(password, hashedPassword, (err, match) => {
//       if (err) {
//         console.error('Error comparing passwords:', err);
//         return res.status(500).send({ error: 'Internal server error' });
//       }

//       if (!match) {
//         return res.status(401).send({ error: 'Invalid email or password' });
//       }

//       res.send({ message: 'Login successful' });
//     });
//   });
//   connection.execSql(request);
// });

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
        console.table(data.recordset);
        res.status(200).send(data.recordset);
        console.log(data);
        db.close();
      });
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
