var duckdb = require('duckdb')
const express = require('express')
var compression = require('compression')

const app = express()
const port = 3000
var con;

app.use(compression())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/casetrend', (req, res) => {
  const neighborhood = req.query.neighborhood || "";
  let query = 'select count(*) as total, EXTRACT(year from opened) as year, extract(month from opened) as month from sfo'
  if (neighborhood) {
  query += " where neighborhood ILIKE '%" + neighborhood + "%'"
  }
  query += ' group by extract(year from opened), extract(month from opened)';
  con.all(query, function(err, response) {
    if (err) {
      throw err;
    }
    res.send(response)
  })
})

app.get('/neighborhood', (req, res) => {
    con.all('select ("Neighborhood") as type, COUNT(*) as total from sfo group by("Neighborhood")', function(err, response) {
      if (err) {
        throw err;
      }
      res.send(response)
    })
})

app.get('/requesttype', (req, res) => {
    const neighborhood = req.query.neighborhood || "";
    let query = 'select ("Request Type") as type, COUNT(*) as total from sfo';
    if (neighborhood) {
      query += " where neighborhood ILIKE '%" + neighborhood + "%'";
    }
    query += ' group by("Request Type")';
    con.all(query, function(err, response) {
      if (err) {
        throw err;
      }
      res.send(response)
    })
})

app.get('/data', (req, res) => {
    const offset = req.query.offset || 1;
    const neighborhood = req.query.neighborhood || "";
    let query = 'select * from sfo';
    if (neighborhood) {
      query += " where neighborhood ILIKE '%" + neighborhood + "%'";
    }
    query += ` LIMIT 2000 OFFSET ${offset}`;
    con.all(query, function(err, response) {
      if (err) {
        throw err;
      }
      res.send(response)
    })
})

app.get('/describe', (req, res) => {
  con.all(`describe sfo`, function(err, response) {
    if (err) {
      throw err;
    }
    res.send(response)
  })
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  // About 26s on a normal 12G laptop
  //------------Initialization of DuckDB---------------------------------------//
  var db = new duckdb.Database(':memory:'); // or a file name for a persistent DB
  con = db.connect();
  con.all('create table sfo as select * FROM "311_Cases.csv"', function(err, res) {
    if (err) {
      throw err;
    }
    console.log(res)
  })
  //------------Initialization of DuckDB---------------------------------------//
})
console.log(`Something`);
