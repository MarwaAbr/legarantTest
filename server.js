var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');

var app = express();

app.use(express.static('www'));
app.use(express.static(path.join('www', 'build')));

app.use(bodyParser.json());


var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/dreamhouse';

if (process.env.DATABASE_URL !== undefined) {
  pg.defaults.ssl = true;
}

var client = new pg.Client(connectionString);
client.connect();

var propertyTable = 'property__c';
var favoriteTable = 'favorite__c';
var contactTable = 'contact';

// setup the demo data if needed
client.query('SELECT * FROM salesforce.contact', function(error, data) {
  if (error !== null) {
    client.query('SELECT * FROM contact', function(error, data) {
      if (error !== null) {
        console.log('Loading Demo Data...');
        require('./db/demo.js')(client);
        console.log('Done Loading Demo Data!');
      }
    });
  }
  else {
    var schema = 'salesforce.';
    propertyTable = schema + 'property__c';
    favoriteTable = schema + 'favorite__c';
    contactTable = schema + 'contact';
  }
});


app.get('/property', function(req, res) {
  client.query('SELECT * FROM ' + propertyTable, function(error, data) {
    res.json(data.rows);
  });
});

app.get('/property/:id', function(req, res) {
  client.query('SELECT ' + propertyTable + '.*, ' + contactTable + '.sfid AS contact_sfid, ' + contactTable + '.name AS contact_name, ' + contactTable + '.email AS contact_email, ' + contactTable + '.phone AS contact_phone, ' + contactTable + '.mobile_phone AS contact_mobile_phone, ' + contactTable + '.title__c AS contact_title, ' + propertyTable + ' INNER JOIN ' + contactTable + ' ON ' + propertyTable + '.contact = ' + contactTable + '.sfid WHERE ' + propertyTable + '.sfid = $1', [req.params.id], function(error, data) {
    res.json(data.rows[0]);
  });
});


app.get('/favorite', function(req, res) {
  client.query('SELECT ' + propertyTable + '.*, ' + favoriteTable + '.sfid AS favorite__c_sfid FROM ' + propertyTable + ', ' + favoriteTable + ' WHERE ' + propertyTable + '.sfid = ' + favoriteTable + '.property__c', function(error, data) {
    res.json(data.rows);
  });
});

app.post('/favorite', function(req, res) {
  client.query('INSERT INTO ' + favoriteTable + ' (property__c) VALUES ($1)', [req.body.property__c], function(error, data) {
    res.json(data);
  });
});

app.delete('/favorite/:sfid', function(req, res) {
  client.query('DELETE FROM ' + favoriteTable + ' WHERE sfid = $1', [req.params.sfid], function(error, data) {
    res.json(data);
  });
});


app.get('/contact', function(req, res) {
  client.query('SELECT * FROM ' + contactTable, function(error, data) {
    res.json(data.rows);
  });
});

app.get('/broker/:sfid', function(req, res) {
  client.query('SELECT * FROM ' + contactTable + ' WHERE sfid = $1', [req.params.sfid], function(error, data) {
    res.json(data.rows[0]);
  });
});

var port = process.env.PORT || 8200;

app.listen(port);

//console.log('Listening at: http://localhost:' + port);
