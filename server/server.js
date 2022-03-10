const express = require("express");
const session = require("express-session");
const bodyParser = require('body-parser');
const dbo = require("./db/conn");

const app = express();
const http = require('http');
const path = require('path')
const server = http.createServer(app);
const { Server } = require("socket.io");
const Ambulance = require("./db/models/ambulance");
const Location = require("./db/models/location");
const io = new Server(server)
var axios = require('axios');
const Dispatch = require("./db/models/dispatch");
const Case = require("./db/models/case");

require("dotenv").config();


const port = process.env.PORT || 5000;

const users = {};

app.use(session({
  secret: 'some secret',
  cookie: { expires: new Date(Date.now() + (30 * 86400 * 1000)) },
}));

io.on('connection', (socket) => {
    socket.on('ambulanceLogin', function (data) {
      console.log(`Ambulance ${data.ambulanceId} connected`)
      users[socket.id] = { id: data.ambulanceId, busy: false, assigned_case: null }
    });

    socket.on('request dispatch', async function() {
      if (users[socket.id].busy == false) {
        let lat = 0.0
        let lng = 0.0
        const ambulance = await Ambulance.findOne({_id: users[socket.id].id})
        const location = await Location.find({ambulance: ambulance._id}).limit(1).sort({$natural:-1})
 
        // different category cases
        const cat1 = await Case.find({category: 1})
        const cat2 = await Case.find({category: 2})
        const cat3 = await Case.find({category: 3})
        const cat4 = await Case.find({category: 4})

        
        if (cat1.length > 0 && users[socket.id].assigned_case == null) {
          for(let i=0; i < cat1.length; i++) {
            const googleMaps = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?region=uk&units=imperial&avoid=highways&traffic_model=best_guess&departure_time=${new Date().getTime().toString()}&origins=${location[0].latitude}%2C${location[0].longitude}&destinations=${cat1[i].latitude}%2C${cat1[i].longitude}
            &key=${process.env.GOOGLE_MAPS}`)

            const dispatches  = await Dispatch.find({assigned_case: cat1[i]._id, assigned_ambulance: null, completed: false})

            if (dispatches.length != 0) {
              if (googleMaps.data.rows[0].elements[0].distance.value <= 8050 || googleMaps.data.rows[0].elements[0].duration.value <= 1200) {
                console.log(`[Category 1]\tSending dispatch associated with case ${cat1[i]._id} to ambulance ${users[socket.id].id} (Estimated journey time: ${googleMaps.data.rows[0].elements[0].duration.text})`)
                users[socket.id].assigned_case = dispatches[0]._id
                users[socket.id].busy = true
                io.to(socket.id).emit("assign dispatch", {googleMaps: googleMaps.data, assigned_case: users[socket.id].assigned_case, dispatch: cat1[i]})
              }
            }
          }
        }

        if (cat2.length > 0 && users[socket.id].assigned_case == null) {
          for(let i=0; i < cat2.length; i++) {
            const googleMaps = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?region=uk&units=imperial&avoid=highways&traffic_model=best_guess&departure_time=${new Date().getTime().toString()}&origins=${location[0].latitude}%2C${location[0].longitude}&destinations=${cat2[i].latitude}%2C${cat2[i].longitude}
            &key=${process.env.GOOGLE_MAPS}`)

            const dispatches  = await Dispatch.find({assigned_case: cat2[i]._id, assigned_ambulance: null, completed: false})

            if (dispatches.length != 0) {
              if (googleMaps.data.rows[0].elements[0].distance.value <= 8050 || googleMaps.data.rows[0].elements[0].duration.value <= 1200) {
                console.log(`[Category 2]\tSending dispatch associated with case ${cat2[i]._id} to ambulance ${users[socket.id].id} (Estimated journey time: ${googleMaps.data.rows[0].elements[0].duration.text})`)
                users[socket.id].assigned_case = dispatches[0]._id
                users[socket.id].busy = true
                io.to(socket.id).emit("assign dispatch", {googleMaps: googleMaps.data, assigned_case: users[socket.id].assigned_case, dispatch: cat2[i]})
              }
            }
          }
        }

        
        if (cat3.length > 0 && users[socket.id].assigned_case == null) {
          for(let i=0; i < cat3.length; i++) {
            const googleMaps = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?region=uk&units=imperial&avoid=highways&traffic_model=best_guess&departure_time=${new Date().getTime().toString()}&origins=${location[0].latitude}%2C${location[0].longitude}&destinations=${cat3[i].latitude}%2C${cat3[i].longitude}
            &key=${process.env.GOOGLE_MAPS}`)

            const dispatches  = await Dispatch.find({assigned_case: cat3[i]._id, assigned_ambulance: null, completed: false})

            if (dispatches.length != 0) {
              if (googleMaps.data.rows[0].elements[0].distance.value <= 8050 || googleMaps.data.rows[0].elements[0].duration.value <= 1200) {
                console.log(`[Category 3]\tSending dispatch associated with case ${cat4[i]._id} to ambulance ${users[socket.id].id} (Estimated journey time: ${googleMaps.data.rows[0].elements[0].duration.text})`)
                users[socket.id].assigned_case = dispatches[0]._id
                users[socket.id].busy = true
                io.to(socket.id).emit("assign dispatch", {googleMaps: googleMaps.data, assigned_case: users[socket.id].assigned_case, dispatch: cat3[i]})
              }
            }
          }
        }

        if (cat4.length > 0 && users[socket.id].assigned_case == null) {
          for(let i=0; i < cat4.length; i++) {
            const googleMaps = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?region=uk&units=imperial&avoid=highways&traffic_model=best_guess&departure_time=${new Date().getTime().toString()}&origins=${location[0].latitude}%2C${location[0].longitude}&destinations=${cat4[i].latitude}%2C${cat4[i].longitude}
            &key=${process.env.GOOGLE_MAPS}`)

            const dispatches  = await Dispatch.find({assigned_case: cat4[i]._id, assigned_ambulance: null, completed: false})

            if (dispatches.length != 0) {
              if (googleMaps.data.rows[0].elements[0].distance.value <= 8050 || googleMaps.data.rows[0].elements[0].duration.value <= 1200) {
                console.log(`[Category 4]\tSending dispatch associated with case ${cat4[i]._id} to ambulance ${users[socket.id].id} (Estimated journey time: ${googleMaps.data.rows[0].elements[0].duration.text})`)
                users[socket.id].assigned_case = dispatches[0]._id
                users[socket.id].busy = true
                io.to(socket.id).emit("assign dispatch", {googleMaps: googleMaps.data, assigned_case: users[socket.id].assigned_case, dispatch: cat4[i]})
              }
            }
          }
        }

      } else {
        const dispatches = await Dispatch.find({_id: users[socket.id].assigned_case})
        if(dispatches.length == 0) {
          users[socket.id].assigned_case = null
          users[socket.id].busy = false
          io.to(socket.id).emit("assign dispatch", {googleMaps: {}, assigned_case: null, dispatch: null, cancelRequest: true})
        } else {
          if(dispatches[0].completed) {
            users[socket.id].assigned_case = null
            users[socket.id].busy = false
            io.to(socket.id).emit("assign dispatch", {googleMaps: {}, assigned_case: null, dispatch: null})
          }
        }
      }
    })

    socket.on('disconnect', async function() {
      if (socket.id in users) {
        if (users[socket.id].assigned_case !== null) {
          const dispatches = await Dispatch.find({assigned_ambulance: users[socket.id].id, completed: false, _id: users[socket.id].assigned_case})

          if (dispatches.length == 1) {
            await Dispatch.updateOne({
              assigned_ambulance: users[socket.id].id, 
              completed: false, 
              _id: users[socket.id].assigned_case
            },
            {
              assigned_ambulance: null
            }
            )
          }
       }

        console.log(`Ambulance ${users[socket.id].id} has disconnected`)
        delete users[socket.id] 
      }
    })

})

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

app.use(require("./routes/dispatcher"));
app.use(require("./routes/case"));
app.use(require("./routes/dispatch"));
app.use(require("./routes/ambulance"));
app.use(require("./routes/location"));

server.listen(port, () => {
  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) throw err
  })
  console.log(`Server is running on port: ${port}`);
});

app.route('/getAmbulanceCount').get((req, res) => {
  if(req.session.authenticated) {
    res.json({'count': Object.keys(users).length})
  } else {
    res.status(401).json({'msg': "Session expired"})
  }
})

app.use(express.static(path.join(__dirname, './public/ambulance')));
app.route('/ambulance/*').get((req, res) => {
  res.sendFile(path.join(__dirname, './public/ambulance', 'index.html'));
})

app.use(express.static(path.join(__dirname, './public/dispatcher')));
app.route('/dispatcher/*').get((req, res) => {
  res.sendFile(path.join(__dirname, './public/dispatcher', 'index.html'));
})

module.exports = app