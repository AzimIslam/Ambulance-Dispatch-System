const { ObjectId } = require('bson');
const express = require('express');
var axios = require('axios');

const caseRoutes = express.Router()

const Case = require("../db/models/case");
const Dispatcher = require("../db/models/dispatcher");

caseRoutes.route('/case/create').post(async(req, res) => {
    if (req.session.authenticated) {
        const user = req.session.user_id
        const result = new Case(req.body)
        result.save()

         await Dispatcher.updateOne(
            { _id: user },
            { $push: {cases: result._id}}
        );

        res.json({id: result._id})
    } else {
        res.status(401).json({'msg': "Session expired"})
    }
});

caseRoutes.route('/case/getDetails/:id').get(async(req, res) => {
    if (req.session.authenticated) {
        try {
            let c = await Case.findOne({_id: req.params.id})
            res.json({'case': c})
        } catch (err) {
            res.status(404).json({'msg': 'Case not found'})
        }
    } else {
        res.status(401).json({'msg': "Session expired"})
    }
})

caseRoutes.route('/case/getAddress/:id').get(async(req, res) => {
    if (req.session.authenticated) {
        const result = await Case.findOne({_id: req.params.id})
        const googleMaps = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${result.latitude},${result.longitude}&key=${process.env.GOOGLE_MAPS}`)
        res.json({'address': googleMaps.data.results[0].formatted_address})
    } else {
        res.status(401).json({'msg': "Session expired"})
    }
})


module.exports = caseRoutes;
