const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = process.env.MY_PORT

const cors = require('cors')

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/exercise/new-user', function(req, res) {
  User.find({username : req.body.username}, function(err, data) {
    if(err) {
      return err;
    }
    
    if(data.length == 0) {
      var user = new User({ username : req.body.username});
      
      user.save(function(err, result) {
        if(err) {
          return err;
        }
        
        res.send(result);
      });
      
    } else {
      res.send('User already taken.');
    }
  }) 
});

app.post('/api/exercise/add', function(req, res) {
  User.findById(req.body.userId, function(err, data) {
    if(err) {
      return err;
    }
    var obj = {
      description : req.body.description,
      duration : req.body.duration,
      date : req.body. date
    };
    
    data.exercises.push(obj);
    
    data.markModified('exercises');
    
    data.save(function(err, result) {
      if(err) {
        return err;
      }
      
      res.send(result);
    });
  }) 
});

app.get('/maps/transpo/ncr', (req, res) => {
    res.sendFile(__dirname + '/views/maps.html')
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



const listener = app.listen(process.env.MY_PORT, () => {
    console.log(process.env);
  console.log('Your app is listening on port ' + process.env.MY_PORT)
})
