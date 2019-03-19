const express = require("express");
const http = require("http");
const logger = require("morgan");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("req-flash");

const app = express();
app.use(session({
    secret: 'djhxcvxfgshajfgjhgsjhfgsakjeauytsdfy',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());
app.use(express.static(__dirname + '/public'));
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

mongoose.promise = global.promise;
mongoose.connect('mongodb+srv://AAs123:AAs123@ahmeddb-k3d6n.mongodb.net/test?retryWrites=true', { useNewUrlParser: true });

var mySchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    today: {
        type: Date,
        default: Date.now()
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { collection: "guestBook" })

var model = new mongoose.model('guestBook', mySchema);


app.use(logger("dev")); // default logger format
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function (request, response) {

    model.find({}, function (err, data1) {
        if (err) {
            response.send({
                statusCode: 500,
                message: 'Data did not selected'
            })
        } else {
            let wholeArray = data1;
            app.locals.wholeArray = wholeArray;
            response.render('index', { deleteSuccessMsg: request.flash('deleteSuccessMsg'), deleteErrorMsg: request.flash('deleteErrorMsg'), wholeArray })
        };
    });

});

app.get("/newEntry", function (request, response) {
    response.render("newEntry");
});

app.get("/edit/:id", function (request, response) {
    var elementId = request.params.id;
    model.findById(elementId, function (err, data1) {
        if (err) {
            response.send({
                statusCode: 500,
                message: 'Data did not selected',
            })
        } else {
            let wholeArray = data1;
            app.locals.wholeArray = wholeArray;
            console.log(data1)
            console.log(wholeArray)
            response.render('update', { wholeArray })
        };
    });

});

app.post("/edit/:id", function (request, response) {
    var elementId = request.params.id;
    const bodyData = request.body;
    if (!bodyData.title || !bodyData.body) {
        response.status(400).send("Entries must have a title and description.");
        return;
    } else {
        var data = {
            title: bodyData.title,
            content: bodyData.body
        }
    }

    console.log(elementId)
    model.findByIdAndUpdate({ _id: elementId }, data, function (err, data1) {
        if (err) {
            response.status(500)
            request.flash('updateErrorMsg', 'Something went wrong while updating post!');
            response.redirect('/');
        } else {
            response.status(200)
            request.flash('updateSuccessMsg', 'Data Updated Successfuly');
            response.redirect('/');
        };
    });
});

app.get("/remove/:id", function (request, response) {
    var elementId = request.params.id;
    console.log(elementId)
    model.findByIdAndDelete(elementId, function (err, data1) {
        if (err) {
            response.status(500)
            request.flash('deleteErrorMsg', 'Something went wrong while deleting post!');
            response.redirect('/');
        } else {
            response.status(200)
            request.flash('deleteSuccessMsg', 'Data Deleted Successfuly');
            response.redirect('/');
        };
    });
});

app.post("/newEntry", function (request, response) {
    const bodyData = request.body;
    if (!bodyData.title || !bodyData.body) {
        response.status(400).send("Entries must have a title and description.");
        return;
    } else {
        var data = {
            title: bodyData.title,
            content: bodyData.body
        }

        var saveData = new model(data);
        saveData.save((err, result) => {
            if (err) {
                response.status(200)
                request.flash('inseretErrorMsg', 'Something went wrong while inserting post!');
                response.redirect('/');
            } else {
                // response.send({
                //     satusCode: 200,
                //     message: 'Data inserted successfuly',
                //     data: result
                // });
                response.status(200)
                request.flash('insertSuccessMsg', 'Post Inserted Successfuly');
                response.redirect('/');
            }
        })
    }
});

app.use(function (request, response) {
    response.status(404).render("404");
});

http.createServer(app).listen(3000, function () {
    console.log("App is runing on port 3000");
});

