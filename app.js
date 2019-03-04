const express  = require("express");
const http = require("http");
const logger = require("morgan");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();

app.use(express.static(__dirname + '/public'));
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

var entries = [];
app.locals.entries = entries;

app.use(logger("dev")); // default logger format
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function(request, response) {
    response.render("index");
});

app.get("/newEntry", function(request, response) {
    response.render("newEntry");
});

app.get("/remove/:id", function(request, response) {
    var elementId = parseInt(request.params.id);
    
    entries.map(function (entry) {

        if (entry.id == elementId) {
            var myindex = elementId - 1;
            entries.splice(myindex, 1);
            //arrayRemove(entries, elementId);
            response.redirect("/");
        } else {
            response.send("Error, Data not delete");
        }
    });

    response.redirect("/");
});

app.post("/newEntry", function(request, response) {
    if(!request.body.title || !request.body.body) {
        response.status(400).send("Entries must have a title and description.")
      return;
    }
    entries.push({
        id: entries.length + 1,
        title: request.body.title,
        content: request.body.body,
        published: new Date()
    });
    response.redirect("/");

});

app.use(function(request, response) {
    response.status(404).render("404");
});

http.createServer(app).listen(3000, function() {
    console.log("App is runing on port 3000");
});