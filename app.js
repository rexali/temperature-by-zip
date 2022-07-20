// app.js

//Includes Node’s built-in path module, Express, Zippity-do-dah,
//and ForecastIO
var path = require("path");
var express = require("express");
var zipdb = require("zippity-do-dah");
var ForecastIo = require("forecastio");
// Creates an Express application
var app = express();
var weather = new ForecastIo("YOUR FORECAST.IO API KEY HERE"); // Creates an ForecastIO object with your API key
// Serves static files out of public
app.use(express.static(path.resolve(__dirname, "public")));
// Uses EJS as the view engine, and serves the views out of a views folder
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");
// Renders the index view if you hit the homepage
app.get("/", function (req, res) {
    res.render("index");
});
// Captures the specified ZIP Code and passes it as req.params[0]
app.get(/^\/(\d{5})$/, function (req, res, next) {
    var zipcode = req.params[0];
   // Captures the specified ZIP Code and passes it as req.params[0]
    var location = zipdb.zipcode(zipcode);
    // Returns {} when no results are found. Continues if the object isn’t empty
    if (!location.zipcode) {
        next();
        return;
    }

    var latitude = location.latitude;
    var longitude = location.longitude;

    weather.forecast(latitude, longitude, function (err, data) {
        if (err) {
            next();
            return;
        }
        // Sends this JSON object with Express’s json method
        res.json({
            zipcode: zipcode,
            temperature: data.currently.temperature
        });
    });

});
// Shows a 404 errorif no other routesare matched
app.use(function (req, res) {
    res.status(404).render("404");
});
// Starts the app on port 3000
app.listen(3000);