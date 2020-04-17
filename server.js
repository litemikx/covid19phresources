const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
const port = process.env.PORT
const fs = require('fs')

const cors = require('cors')

app.use(cors())                   

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static(path.resolve('./public')))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html') // '/views/index.html')
});

app.get('/maps/transpo/ncr', (req, res) => {
  res.sendFile(__dirname + '/views/maps.html')
});

app.get('/health', (req, res) => {
  res.sendFile(__dirname + '/views/health.html')
});

app.get('/hotlines', (req, res) => {
  res.sendFile(__dirname + '/views/hotlines.html')
});

app.get('/trackers', (req, res) => {
  res.sendFile(__dirname + '/views/trackers.html')
});

app.get('/data/:region/:city', (req, res, next) => {
    var region = req.params.region;
    var city = req.params.city;
    fs.readFile(__dirname + '/data/region/' + region + '.json', function(err, data) {
      if(err) {
        return err;
      }
      var obj = JSON.parse(data);

      if(obj[city] != 'undefined' && obj[city] != null && obj[city] != '') {
        res.json(obj[city]);
      } else {
        res.json({});
      }

      
    })

});

// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + process.env.PORT)
})
