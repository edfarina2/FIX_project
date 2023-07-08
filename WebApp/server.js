
// set up ======================================================================
// get all the tools we need

var express  = require('express');
var session  = require('express-session');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');

// var https = require('https');
// var credentials = {key: privateKey, cert: certificate};

var app      = express();
var port     = process.env.PORT || 8086;

var env = process.env.NODE_ENV || 'local';

var async = require('async');
var passport = require('passport');
var flash    = require('connect-flash');
multer  = require('multer')

path = require('path');

oracle_call = require('./app/oracle_calls/oracle_calls');

//  https://www.npmjs.com/package/i18n-node-angular?activeTab=readme
//  https://github.com/mashpie/i18n-node
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// configuration ===============================================================
// connect to our database

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());


app.use(express.static(__dirname + '/public'));
// set the static files location /public/img will be /img for users


storage = multer.diskStorage({
    destination: function (req, file, cb) {
      console.log(file)
        cb(null, './public/Uploads')
    },
    filename: function (req, file, cb) {
  // var final_name=req.body["originalname"];
   console.log(file)
        cb(null, file["originalname"]);
  }
});
upload = multer({ storage: storage }).single('file');



app.set('view engine', 'ejs'); // set up ejs for templating



// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
// var httpsServer = https.createServer(credentials, app);
// httpsServer.listen(port);
app.listen(port);
console.log('The magic happens on port ' + port);

process.on('uncaughtException',function(err){ console.error(err)})
process.on('error', function(err) {
  if (err.code !== 'ECONNRESET') throw err;
});
// process.on('uncaughtException', function (err) {
//     console.error(err.stack);
//     console.log("Node NOT Exiting...");
// });
