const express = require('express');
const bcrypt = require("bcrypt");
var axios = require('axios');

const ambulanceRoutes = express.Router();

const Ambulance = require("../db/models/ambulance");
const Hospital = require("../db/models/hospital")
const Location = require("../db/models/location")

ambulanceRoutes.route('/api/ambulance/login').post(async(req, res) => {
    const { username, password } = req.body
    if (username && password) {
      if (req.session.authenticated) {
        res.json(req.session);
      } else {
          Ambulance.findOne({username: username}, (err, record) => {
            if (err) {
              res.status(500).json({'msg': "Internal Server Error"})
            } else {
              if (record) {
                let correctPassword = bcrypt.compareSync(password, record.password);
                if (correctPassword) {
                  req.session.authenticated = true;
                  req.session.user_id = record.id;
                  res.json(req.session);
                } else {
                  res.status(403).json({'msg': "Invalid username and password"})
                }
              } else {
                res.status(403).json({'msg': "Invalid username and password"})
              }
            }
          });
      }
    } else {
      res.status(403).json({'msg': "Invalid username and password"})
    }
})

ambulanceRoutes.route('/api/ambulance/getHospital').get(async (req, res) => {
  if(req.session.authenticated) {
     let ambulance = await Ambulance.findOne({_id: req.session.user_id})
     let hospital = await Hospital.findOne({_id: ambulance.hospital})
     console.log(hospital)

     let formatted_addr = `${hospital.hospital_name} ${hospital.address1} ${hospital.city} ${hospital.postcode}`
     const googleMaps = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${formatted_addr.trim()}&key=${process.env.GOOGLE_MAPS}`)

     res.json(
        {
          lat: googleMaps.data.results[0].geometry.location.lat,
          lng: googleMaps.data.results[0].geometry.location.lng
        }
     );

  } else {
    res.status(401).json({'msg': "Session expired"})
  }
}) 

ambulanceRoutes.route('/api/ambulance/logout').post((req, res) => {
    req.session.destroy()
    res.json({success: true})
  })
  
ambulanceRoutes.route('/api/ambulance/checkSession').get((req, res) => {
    if (req.session.authenticated) {
      res.json(req.session)
    } else {
      res.status(401).json({'msg': "Session expired"})
    }
});

ambulanceRoutes.route('/api/ambulance/getLocation/:id').get((async (req, res) => {
  if(req.session.authenticated) {
    if(req.params.id != "undefined") {
      const location = await Location.findOne({ambulance: req.params.id}).limit(1).sort({$natural:-1})
      res.json({lat: location.latitude, lng: location.longitude})
    } else {
      res.status(400).json({'msg': 'Invalid Request'})
    }
  } else {
    res.status(401).json({'msg': "Session expired"})
  }
}))

module.exports = ambulanceRoutes