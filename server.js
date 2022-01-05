const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;


const data = fs.readFileSync('./database.json');
const conf = JSON.parse(data);
const mysql = require('mysql');

// mysql connection
const connection = mysql.createConnection({
    host: conf.host,
    user: conf.user,
    password: conf.password,
    port: conf.port,
    database: conf.database
});
connection.connect();

//파일 업로드
const multer = require('multer');
const upload = multer({dest: './upload'})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.get('/api/customers',(req,res) =>{
    connection.query(
        "SELECT * FROM management.CUSTOMER WHERE isDeleted = 0",
        (err,rows,fields) =>{
            res.send(rows);
        }
    );
});

app.use('/image',express.static('./upload'));
app.post('/api/customers',upload.single('image'),(req, res)=>{
    let sql  = 'INSERT INTO management.CUSTOMER VALUES (null, ?, ? , ?, ?, ?, now(), 0)';
    let image = '/image/' + req.file.filename;
    let name = req.body.name;
    let birthday = req.body.birthday;
    let gender = req.body.gender;
    let job = req.body.job;

    let params = [image, name, birthday, gender, job];
    connection.query(sql, params,
        (err, rows, fields)=>{
            res.send(rows);
        }
    ); 
});

app.delete('/api/customers/:id', (req, res) =>{
    let sql = 'UPDATE management.CUSTOMER SET isDeleted = 1 WHERE id = ?';
    let params = [req.params.id];
    connection.query(sql, params,
        (err, rows, fields) =>{
            res.send(rows);
        }
    )
});

app.listen(port, () => console.log(`Listening on port ${port}`));
