var express = require('express');
var app = express();

var couchbase = require('couchbase')
var cluster = new couchbase.Cluster('couchbase://localhost/');
var bucket = cluster.openBucket('default');
var N1qlQuery = couchbase.N1qlQuery;

bucket.manager().createPrimaryIndex(function() {
  bucket.upsert('user:nethra', {
    'email': 'nethra.madesh@gmail.com', 'password': 'Tesco@123'
  },
  function (err, result) {
    bucket.get('user:nethra', function (err, result) {
      console.log('Got result: %j', result.value);
      bucket.query(
      N1qlQuery.fromString('SELECT password FROM default where email = "nethra.madesh@gmail.com" LIMIT 1'),
      function (err, rows) {
        console.log("Got rows: %j", rows);
      });
    });
  });
});

app.listen(3000)
{
	console.log("server running on port 3000");
}