const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');

const routes = require('./routes');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const connectedUsers = {};
  
io.on('connection', socket => {
  const { user } = socket.handshake.query;

  console.log(user, socket.id);
  connectedUsers[user] = socket.id;  
/*   console.log('New conenction', socket.id);

  socket.on('hello', message => {
    console.log(message)
  })

  setTimeout(() => {
    socket.emit('world', {
      message: 'from: Backend... to: Frontend...'
    })
  }, 5000); */
});

mongoose.connect('mongodb+srv://linkyouweb:RKytglPrfF0cMhH0@cluster0-sbkpk.mongodb.net/tindev?retryWrites=true&w=majority', {useNewUrlParser : true });

//middleware
app.use((req, res, next) => {
  req.io = io;
  req.connectedUsers = connectedUsers;
  return next();
});
app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333);