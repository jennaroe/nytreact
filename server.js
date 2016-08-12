// Include Server Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongojs = require('mongojs');

// Create Instance of Express
var app = express();
var PORT = process.env.PORT || 3000; // Sets an initial port. We'll use this later in our listener

// Run Morgan for Logging
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type:'application/vnd.api+json'}));

app.use(express.static('./public'));

// -------------------------------------------------

// MongoDB Configuration configuration (Change this URL to your own DB)
var databaseUrl = 'nytreact';
var collections = ["articles"];

// use mongojs to hook the database to the db variable 
var db = mongojs(databaseUrl, collections);

db.on('error', function (err) {
  console.log('MongoDB Error: ', err);
});


// -------------------------------------------------

// Main Route. This route will redirect to our rendered React application
app.get('/', function(req, res){
  res.sendFile('./public/index.html');
})

app.get('/saved', function(req, res) {

    db.articles.find({}).sort({date: -1}).limit(5, function(err, doc){

      if(err){
        console.log(err);
      }
      else {
        res.send(doc);
      }
    })
});

// This is the route we will send POST requests to save each search.
app.post('/saved/', function(req, res){
  console.log("BODY: " + req.body);
  var article = req.body;
   
  
  db.articles.insert(article, function(err){
    if(err){
      console.log(err);
    }
    else {
      res.send("Saved Search");
    }
  })
});

app.post('/api/delete/', function(req, res) {

  // save the article object which has the article id to the variable
  var article = req.body;

  // had to use .remove() instead of .deleteOne() but not sure why.
  db.articles.remove({"_id": (mongojs.ObjectId(article.article_id))}, function(err, docs) {
    
    if (err) throw err;

    console.log('article deleted');

  }); // end db.articles.remove()

}); // end app.post()


// -------------------------------------------------

// Listener
app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});
