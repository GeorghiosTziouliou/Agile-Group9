const express = require('express');
const app = express();
const path = require('path');
const PORT = 8800;


app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.json())

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
    }
);
app.get('/dist/css/main.css',(req, res)=>{
    res.sendFile(path.join(__dirname, '/dist/css/main.css'));
    }
);
app.get('/dist/js/uikit.js',(req, res)=>{
    res.sendFile(path.join(__dirname, '/dist/js/uikit.js'));
    }
);
app.get('/src/js/uikit.js',(req, res) => {
    res.sendFile(path.join(__dirname, '/src/js/uikit.js'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    }
);
