const express = require("express");
const path = require("path");
var fs = require("fs");
const util = require("util");

// The built-in util package can be used to create Promise-based versions of functions using node style callbacks
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

// Initialize the app and create a port
const app = express();
const PORT = process.env.PORT || 3000;

// Set up body parsing, static, and route middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));

//HTML ROUTES
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

//API ROUTES
app.get("/api/notes", function(req, res) {
    //READ JSON FILE
    fs.readFile("./db/db.json", "utf8", function(error, data) {

        if (error) {
        return console.log(error);
        }
    
        console.log(JSON.parse(data)); //FOR DEBUG
        let newData = JSON.parse(data);
        res.json(newData);
    
    });

});

app.post("/api/notes", function(req, res) {
    console.log(req.body);
    let newData = req.body;
    let oldData = [];

    readFileAsync("./db/db.json", "utf8", function(error, data) {

        if (error) {
        return console.log(error);
        }
        console.log("INSIDE POST");
        console.log(JSON.parse(data)); //FOR DEBUG
        oldData = JSON.parse(data);

        oldData.push(newData);
        console.log(oldData); //FOR DEBUG

        writeFileAsync("./db/db.json", JSON.stringify(oldData), function(err) {
            console.log("INSIDE WRITE FILE"); //FOR DEBUG

            console.log(oldData); //FOR DEBUG
            if (err) {
              return console.log(err);
            }
          
            console.log("Success!");
            console.log(oldData); //FOR DEBUG
    
          });

    })

});


app.delete("/api/notes/:id", function(req, res) {
    res.json(false);
});

app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});