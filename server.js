var express = require('express');
var bcrypt = require('bcrypt');
var app = express();
var bodyParser = require('body-parser')
var couchbase = require('couchbase')
var cluster = new couchbase.Cluster('couchbase://localhost/');
var bucket = cluster.openBucket('default');
var N1qlQuery = couchbase.N1qlQuery;
const saltRounds = 10;
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.json({limit:'100kb'}));


app.get('/usercredential', function(req, res){
  bucket.manager().createPrimaryIndex(function() {
 console.log(req.query.email)
    bucket.get('user:'+req.query.email, function (err, result) {
      console.log(result.value.password);
    //  bucket.query(
      //N1qlQuery.fromString('SELECT pwd FROM default where email = "dinesh3@gmail.com" LIMIT 1'),
     // function (err, rows) {
      //  console.log("Got rows: %j", rows);
        if(result!==null && result.value!==null)
        {
        res.send(result.value.password);
      }
      else
      {
        res.send(null);
      }
      //});
    //});
  });
  
});
});
app.post('/usercredential/validate', function(req, res){
  bucket.manager().createPrimaryIndex(function() {
 
    bucket.get('user:'+req.body.UserCredential.email, function (err, result) {
      console.log(result.value.password);
    //  bucket.query(
      //N1qlQuery.fromString('SELECT pwd FROM default where email = "dinesh3@gmail.com" LIMIT 1'),
     // function (err, rows) {
      //  console.log("Got rows: %j", rows);
        if(result!==null && result.value!==null)
        {
         bcrypt.compare(req.body.UserCredential.password, result.value.password, function(err, result){
          console.log(result);
          if(result)
          {
            res.send(result);
          }
          else
          {res.statusCode = 401

            res.send("Unauthorized");
          }
         }) 
        
      }
      else
      {
        res.statusCode = 401

            res.send("Unauthorized");
      }
      //});
    //});
  });
  
});
});



app.post('/usercredential', function(req, res){
  bcrypt.hash(req.body.UserCredential.password, saltRounds, function(err, hash)
  {
if(err==null)
{
  req.body.UserCredential.password = hash;
  console.log(req.body.UserCredential);
    bucket.manager().createPrimaryIndex(function() {

  bucket.upsert('user:'+req.body.UserCredential.email,  req.body.UserCredential
  ,
   function (err, result) {
    if(err==null)
    {
      res.send("upsert operation done successfully")
    }
   });
});
  }

  });
  
});

/*bucket.manager().createPrimaryIndex(function() {
  bucket.upsert('user:nethra', {
    'email': 'nethra.madesh@gmail.com', 'pwd': 'Tesco@123'
  },
  function (err, result) {
    bucket.get('user:nethra', function (err, result) {
      console.log('Got result: %j', result.value);
      bucket.query(
      N1qlQuery.fromString('SELECT pwd FROM default where email = "nethra.madesh@gmail.com" LIMIT 1'),
      function (err, rows) {
        console.log("Got rows: %j", rows);
      });
    });
  });
  
});*/

app.listen(3002)
{
	console.log("server running on port 3002");
}