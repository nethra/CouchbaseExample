var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var couchbase = require('couchbase')
var cluster = new couchbase.Cluster('couchbase://localhost/');
var bucket = cluster.openBucket('default');
var N1qlQuery = couchbase.N1qlQuery;
app.use(bodyParser.json({limit:'100kb'}));


app.get('/usercredential', function(req, res){
  bucket.manager().createPrimaryIndex(function() {
 console.log(req.query.username)
    bucket.get('user:'+req.query.username, function (err, result) {
      
      bucket.query(
      N1qlQuery.fromString('SELECT pwd FROM default where email = "nethra.madesh@gmail.com" LIMIT 1'),
      function (err, rows) {
        //console.log("Got rows: %j", rows);
        res.send(rows[0].pwd);
      });
    });
  });
  
});



app.post('/usercredential', function(req, res){
  console.log(req.body);
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

app.listen(3000)
{
	console.log("server running on port 3000");
}