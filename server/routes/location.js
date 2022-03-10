const { ObjectId } = require('bson');
const express = require('express');

const Location = require("../db/models/location");

const locationRoutes = express.Router();

locationRoutes.route('/location/send').post(async(req, res) => {
    if (req.session.authenticated) {
        let {lng, lat} = req.body
        let locationObj = {
            longitude: lng,
            latitude: lat,
            ambulance: ObjectId(req.session.user_id)
        }

        Location.create(locationObj, (err, record) => {
            if (err) res.status(500).json({'msg': 'Internal Server Error'})
            res.json({location_id: record._id})
        })
    } else {
        res.status(401).json({'msg': 'Session Expired'})
    }
})


module.exports = locationRoutes