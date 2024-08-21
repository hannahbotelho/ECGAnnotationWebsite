const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const basicAuth = require('express-basic-auth');
const app = express();
var bodyParser = require('body-parser');

require('dotenv').config();

const MAX_RETRIES = 10;
const RETRY_DELAY = 5000; // 5 seconds

let retryCount = 0;
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

const auth = basicAuth({
    users: {
        USER1: 'XXX',
        USER2: 'YYY',
    },
});

app.get('/authenticate', auth, (req, res) => {
    console.log('auth called');
    if (req.auth.user === 'USER1') {
        res.send('1');
    } else if (req.auth.user === 'USER2') {
        res.send('2');
    } else if (req.auth.user === 'USER3') {
        res.send('3');
    }
});

const mysqlConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'admin',
    port: process.env.DB_PORT || '3306'
};

let connection;

const connectToDatabase = () => {
    connection = mysql.createConnection({ ...mysqlConfig, database: 'ecgannotation' });

    const connectWithRetry = () => {
        connection.connect(err => {
            if (err) {
                console.error('Error connecting to the database: ', err);
                retryCount++;
                
                if (retryCount <= MAX_RETRIES) {
                    console.log(`Retrying connection in ${RETRY_DELAY / 1000} seconds...`);
                    setTimeout(connectWithRetry, RETRY_DELAY);
                } else {
                    console.error('Max retries reached. Could not connect to the database.');
                }
                
                return;
            }
            console.log('Connected to the MySQL database');
            createTables(); // Create tables after successful connection
        });
    };

    connectWithRetry();
};

const createDatabaseAndTables = () => {
    connection = mysql.createConnection(mysqlConfig);
    
    connection.query('CREATE DATABASE IF NOT EXISTS ecgannotation', (err, results) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Database created successfully');
        connectToDatabase(); // Connect to the database after it's created
    });
};

const createTables = () => {
    const createCommentsTable = `
        CREATE TABLE IF NOT EXISTS Comments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            ECGID INT,
            AnnID INT,
            Comment TEXT
        )`;
    const createAnnotationFirstTable = `
        CREATE TABLE IF NOT EXISTS AnnotationFirst (
            id INT AUTO_INCREMENT PRIMARY KEY,
            ECGID INT,
            LeadID INT,
            PointIndex INT,
            PointType VARCHAR(255)
        )`;
    const createAnnotationSecondTable = `
        CREATE TABLE IF NOT EXISTS AnnotationSecond (
            id INT AUTO_INCREMENT PRIMARY KEY,
            ECGID INT,
            LeadID INT,
            PointIndex INT,
            PointType VARCHAR(255)
        )`;
    const createAnnotationThirdTable = `
        CREATE TABLE IF NOT EXISTS AnnotationThird (
            id INT AUTO_INCREMENT PRIMARY KEY,
            ECGID INT,
            LeadID INT,
            PointIndex INT,
            PointType VARCHAR(255)
        )`;

    connection.query(createCommentsTable, (err, results) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Comments table created successfully');
    });
    connection.query(createAnnotationFirstTable, (err, results) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('AnnotationFirst table created successfully');
    });
    connection.query(createAnnotationSecondTable, (err, results) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('AnnotationSecond table created successfully');
    });
    connection.query(createAnnotationThirdTable, (err, results) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('AnnotationThird table created successfully');
    });
};

// Initialize the database and create tables
createDatabaseAndTables();
// Insert Comment Method
app.post('/insertComment', function(req, res) {
    const ecgID = req.body.ecgID;
    const comment = req.body.comment;
    const annID = req.body.annID;

    const INSERT_USER_QUERY = 'INSERT INTO Comments (ECGID, AnnID, Comment) VALUES (?, ?, ?)';
    console.log(`INSERT INTO Comments (ECGID, AnnID, Comment) VALUES (${ecgID}, ${annID}, ${comment})`);
    connection.query(INSERT_USER_QUERY, [ ecgID, annID, comment ], function(err, rows) {
        if(err) {
            console.log(err);
            res.json({'status': 402, 'msg': err});
        } else {
            console.log(rows);
            res.json({'status': 200, 'msg': rows});
        }
    });
    console.log('Insert Hit');
});

app.post('/updateComment', function(req, res) {
    const ecgID = req.body.ecgID;
    const comment = req.body.comment;
    const annID = req.body.annID;

    const UPDATE_QUERY = 'UPDATE Comments SET Comment = ? WHERE ECGID = ? AND AnnID = ?';
    console.log(`INSERT INTO Comments (ECGID, AnnID, Comment) VALUES (${ecgID}, ${annID}, ${comment})`);
    connection.query(UPDATE_QUERY, [comment, ecgID, annID], function(err, rows) {
        if(err) {
            console.log(err);
            res.json({'status': 402, 'msg': err});
        } else {
            console.log(rows);
            res.json({'status': 200, 'msg': rows});
        }
    });
    console.log('Update Hit');
});

// Get Comment Method
app.get('/getComment', function (req, res) {

    const{ecgID, annID} = req.query;
    const SELECT_QUERY = 'SELECT * FROM Comments WHERE ECGID = ? AND AnnID = ?';
    console.log(`SELECT * FROM Comments WHERE ECGID = ${ecgID} AND AnnID = ${annID}`);

    connection.query(SELECT_QUERY, [ ecgID, annID ],  function (err, results) {
        if(err) {
            console.log(err);
            return res.send(err)
        } else {
            console.log(results)
            res.send(results);
        }
    })
});

// Insert Methods
app.post('/insertFirstAnnotator', function(req, res) {
    const ecgID = req.body.ecgID;
    const leadID = req.body.leadID;
    const pointIndex = req.body.pointIndex;
    const pointType = req.body.pointType;

    const INSERT_USER_QUERY = 'INSERT INTO AnnotationFirst (ECGID, LeadID, PointIndex, PointType) VALUES (?, ?, ?, ?)';
    console.log(`INSERT INTO AnnotationFirst (ECGID, LeadID, PointIndex, PointType) VALUES (${ecgID}, ${leadID}, ${pointIndex}, ${pointType})`);
    connection.query(INSERT_USER_QUERY, [ ecgID, leadID, pointIndex, pointType ], function(err, rows) {
        if(err) {
            console.log(err);
            res.json({'status': 402, 'msg': err});
        } else {
            console.log(rows);
            res.json({'status': 200, 'msg': rows});
        }
    });
    console.log('Insert Hit');
});

app.post('/insertSecondAnnotator', function(req, res) {
    const ecgID = req.body.ecgID;
    const leadID = req.body.leadID;
    const pointIndex = req.body.pointIndex;
    const pointType = req.body.pointType;

    const INSERT_USER_QUERY = 'INSERT INTO AnnotationSecond (ECGID, LeadID, PointIndex, PointType) VALUES (?, ?, ?, ?)';
    console.log(`INSERT INTO AnnotationSecond (ECGID, LeadID, PointIndex, PointType) VALUES (${ecgID}, ${leadID}, ${pointIndex}, ${pointType})`);
    connection.query(INSERT_USER_QUERY, [ ecgID, leadID, pointIndex, pointType ], function(err, rows) {
        if(err) {
            console.log(err);
            res.json({'status': 402, 'msg': err});
        } else {
            console.log(rows);
            res.json({'status': 200, 'msg': rows});
        }
    });
    console.log('Insert Hit');
});

app.post('/insertThirdAnnotator', function(req, res) {
    const ecgID = req.body.ecgID;
    const leadID = req.body.leadID;
    const pointIndex = req.body.pointIndex;
    const pointType = req.body.pointType;

    const INSERT_USER_QUERY = 'INSERT INTO AnnotationThird (ECGID, LeadID, PointIndex, PointType) VALUES (?, ?, ?, ?)';
    console.log(`INSERT INTO AnnotationThird (ECGID, LeadID, PointIndex, PointType) VALUES (${ecgID}, ${leadID}, ${pointIndex}, ${pointType})`);
    connection.query(INSERT_USER_QUERY, [ ecgID, leadID, pointIndex, pointType ], function(err, rows) {
        if(err) {
            console.log(err);
            res.json({'status': 402, 'msg': err});
        } else {
            console.log(rows);
            res.json({'status': 200, 'msg': rows});
        }
    });
    console.log('Insert Hit');
});


// Delete Methods

app.post('/deleteFirstAnnotator', function(req, res) {

    const ecgID = req.body.ecgID;
    const leadID = req.body.leadID;
    const pointIndex = req.body.pointIndex;

    const DELETE_QUERY = 'DELETE FROM AnnotationFirst WHERE ECGID = ? AND LeadID = ? AND PointIndex = ?';
    console.log(`DELETE FROM AnnotationFirst (ECGID, LeadID, PointIndex) VALUES (${ecgID}, ${leadID}, ${pointIndex})`);
    connection.query(DELETE_QUERY, [ ecgID, leadID, pointIndex ], function(err, rows) {
        if(err) {
            console.log(err);
            res.json({'status': 402, 'msg': err});
        } else {
            console.log(rows);
            res.json({'status': 200, 'msg': rows});
        }
    });
    console.log('DELETE Hit');
});

app.post('/deleteSecondAnnotator', function(req, res) {

    const ecgID = req.body.ecgID;
    const leadID = req.body.leadID;
    const pointIndex = req.body.pointIndex;

    const DELETE_QUERY = 'DELETE FROM AnnotationSecond WHERE ECGID = ? AND LeadID = ? AND PointIndex = ?';

    connection.query(DELETE_QUERY, [ ecgID, leadID, pointIndex ], function(err, rows) {
        if(err) {
            console.log(err);
            res.json({'status': 402, 'msg': err});
        } else {
            console.log(rows);
            res.json({'status': 200, 'msg': rows});
        }
    });
    console.log('DELETE Hit');
});

app.post('/deleteThirdAnnotator', function(req, res) {

    const ecgID = req.body.ecgID;
    const leadID = req.body.leadID;
    const pointIndex = req.body.pointIndex;

    const DELETE_QUERY = 'DELETE FROM AnnotationThird WHERE ECGID = ? AND LeadID = ? AND PointIndex = ?';

    connection.query(DELETE_QUERY, [ ecgID, leadID, pointIndex ], function(err, rows) {
        if(err) {
            console.log(err);
            res.json({'status': 402, 'msg': err});
        } else {
            console.log(rows);
            res.json({'status': 200, 'msg': rows});
        }
    });
    console.log('DELETE Hit');
});


var url = require( 'url' );
var queryString = require( 'querystring' );

app.get('/api/get', function (req, res) {

    var theUrl = url.parse( req.url );

    // gets the query part of the URL and parses it creating an object
    var queryObj = queryString.parse( theUrl.query );

    // queryObj will contain the data of the query as an object
    // and jsonData will be a property of it
    // so, using JSON.parse will parse the jsonData to create an object
    var obj = JSON.parse( queryObj.jsonData );

    console.log( obj.foo );

});



// Get Methods

app.get('/getFirstAnnotator', function (req, res) {

    const{ecgID, leadID, pointType} = req.query;
    const SELECT_QUERY = 'SELECT * FROM AnnotationFirst WHERE ECGID = ? AND LeadID = ? AND PointType = ?';
    console.log(`SELECT * FROM AnnotationFirst WHERE ECGID = ${ecgID} AND LeadID = ${leadID} AND PointType = ${pointType}`);
    console.log('Select Query Hit');

    connection.query(SELECT_QUERY, [ ecgID, leadID, pointType ],  function (err, results) {
        if(err) {
            console.log(err);
            return res.send(err)
        } else {
            console.log(results)
            res.send(results);
        }
    })
});

app.get('/getSecondAnnotator', function (req, res) {

    const{ecgID, leadID, pointType} = req.query;
    const SELECT_QUERY = 'SELECT * FROM AnnotationSecond WHERE ECGID = ? AND LeadID = ? AND PointType = ?';
    console.log(`SELECT * FROM AnnotationSecond WHERE ECGID = ${ecgID} AND LeadID = ${leadID} AND PointType = ${pointType}`);
    connection.query(SELECT_QUERY, [ ecgID, leadID, pointType ],  function (err, results) {
        if(err) {
            console.log(err);
            return res.send(err)
        } else {
            console.log(results)
            res.send(results);
        }
    })
});

app.get('/getThirdAnnotator', function (req, res) {

    const{ecgID, leadID, pointType} = req.query;
    const SELECT_QUERY = 'SELECT * FROM AnnotationThird WHERE ECGID = ? AND LeadID = ? AND PointType = ?';
    console.log(`SELECT * FROM AnnotationThird WHERE ECGID = ${ecgID} AND LeadID = ${leadID} AND PointType = ${pointType}`);
    connection.query(SELECT_QUERY, [ ecgID, leadID, pointType ],  function (err, results) {
        if(err) {
            console.log(err);
            return res.send(err)
        } else {
            console.log(results)
            res.send(results);
        }
    })
});



app.get('/api/getList', (req,res) => {
    var list = ["item1", "item2", "item3"];
    res.json(list);
    console.log('Sent list of items');
});

// Starting the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
