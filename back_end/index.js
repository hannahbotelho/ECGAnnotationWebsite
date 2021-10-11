const express = require('express')
const cors = require('cors')
const mysql = require('mysql')
const basicAuth = require('express-basic-auth');
const app = express();
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.use(cors());
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

var ip = require("ip");
console.dir ( ip.address() );



const auth = basicAuth({
    users: {
        gab_ann: '3rugiw',
        jake_ann: '8ejibu',
    },
});

app.get('/authenticate', auth, (req, res) => {
    console.log('auth called');
    if (req.auth.user === 'gab_ann') {
        res.send('1');
    } else if (req.auth.user === 'jake_ann') {
        res.send('2');
    } else if (req.auth.user === 'seb_ann') {
        res.send('3');
    }
});

var connection = mysql.createConnection({
    host     : 'tinman',
    user     : 'root',
    password : '1234udel',
    database : 'ECGDB',
    port : 8586
});

console.log('Connecting to the MySQL...');
connection.connect(err => {
    if(err) {
        console.log(err);
    } else {
        console.log('Connection to MySQL Established');
    }
});

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
    console.log('Insert Hit');
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

const port = 5000;
const hostAddress = 'http://tinman.cis.udel.edu/ECGAnnotation/backend';
app.listen(port);

console.log('App is listening on port ' + port);
