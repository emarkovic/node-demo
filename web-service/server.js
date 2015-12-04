/*
    server.js
    main server script for our task list web service
*/

var port = 8080;

//load all modules we need 
//express web serverframework
var express = require('express');
//sqlite library
var sqlite = require('sqlite3');
//body parser
var bodyParser = require('body-parser');

//create a new express application
var app = express();

//add a route for our home page
// app.get('/', function (req, res) {
//     //res is used to write stuff back to the client
//     res.send('<h1>Hello world!</h1>');
// });

//tell express to serve statis files from the static subdir
app.use(express.static(__dirname + '/static'));

//tell express to parse post body data as json
app.use(bodyParser.json());

app.get('/api/tasks', function (req, res, next) {
    var sql = 'select rowid,title,done,createdOn from tasks where done != 1';
    db.all(sql, function (err, rows) {
        if (err) {
            return next(err);
        }

        //send rows back as json
        res.json(rows);
    });
});

//when someone posts to api tasks this is what we call
app.post('/api/tasks', function (req, res, next) {
    var newTask = {
        title: req.body.title,
        done: false,
        createdOn: new Date()
    };
    //write sql to put into db
    var sql = 'insert into tasks(title, done, createdOn) values (?, ?, ?)';
    db.run(sql, [newTask.title, newTask.done, newTask.createdOn], function (err) {
        if (err) {
            return next(err);
        }

        res.status(201).json(newTask);
    });
});

//when someone puts to /api/tasks/<task-id>
app.put('/api/tasks/:rowid', function (req, res, next) {
    var sql = 'update tasks set done=? where rowid =?';
    //dont do this
    //var sql = 'update tasks set done=' + req.body
    db.run(sql, [req.body.done, req.params.rowid], function (err) {
        if (err) {
            return next(err);
        }

        res.json(req.body);
    })
})

//create a new database
var db = new sqlite.Database(__dirname + '/data/tasks.db', function (err) {
    if (err) {
        throw err;
    }

    var sql = 'create table if not exists tasks(title string, done int, createdOn datetime)';
    db.run(sql, function (err) {
        if (err) {
            throw err;
        }
    });

    //start the server 
    app.listen(port, function () {
        console.log('Listening on http://localhost:' + port);
    });
});



