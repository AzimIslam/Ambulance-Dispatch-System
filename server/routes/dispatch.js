const express = require('express');
var axios = require('axios');

const dispatchRoutes = express.Router()


const Dispatch = require("../db/models/dispatch");
const Dispatcher = require('../db/models/dispatcher');
const Case = require('../db/models/case');
const Location = require('../db/models/location')

dispatchRoutes.route('/dispatch/create').post(async(req, res) => {
    if (req.session.authenticated) {
        const dispatchObj = new Dispatch({assigned_case: req.body.case})
        dispatchObj.save()

        res.json({id: dispatchObj._id})
    } else {
        res.status(401).json({'msg': 'Session expired'})
    }
});

dispatchRoutes.route('/dispatch/assignAmbulance').put(async(req, res) => {
    if (req.session.authenticated) {
        await Dispatch.updateOne({_id: req.body.assigned_case}, {assigned_ambulance: req.body.assigned_ambulance})
        res.json({'status': 'OK'})
    } else {
        res.status(401).json({'msg': 'Session expired'})
    }
});

dispatchRoutes.route('/dispatch/markComplete').put(async(req, res) => {
    if (req.session.authenticated) {
        await Dispatch.updateOne({assigned_case: req.body.case}, {completed: true})
        res.json({'status': 'OK'})
    } else {
        res.status(401).json({'msg': 'Session expired'})
    }
});

dispatchRoutes.route('/dispatch/getAllDispatches').get(async(req, res) => {
    if (req.session.authenticated) {
        let cases = []
        let response = []
        
        await Dispatcher.findOne({_id: req.session.user_id})
        .then(result => {
            cases = result.cases
        })

        for(let i=0; i <= cases.length; i++) {
            let addr = ""
            let patientName = ""
            let id = ""
            let cat = 1
            let assigned = false
            await Case.findOne({_id: cases[i]})
            .then(async(result) => {
                const googleMaps = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${result.latitude},${result.longitude}&key=${process.env.GOOGLE_MAPS}`)
                addr = googleMaps.data.results[0].formatted_address
                patientName = `${result.first_name} ${result.surname}`
                id = result._id
                cat = result.category
            })
            .catch(err => {;})
            

            await Dispatch.findOne({assigned_case: cases[i], completed: false})
            .then((result) => {
                if(result.assigned_ambulance != null) {
                    assigned = true
                }
            })
            .catch(err => {;})
            if (addr != "") {
                response.push({
                    id: id,
                    name: patientName,
                    addr: addr,
                    assigned: assigned,
                    cat: cat
                })
            }
        }

        res.json({'dispatches': response})
    }
})

dispatchRoutes.route('/dispatch/delete').delete(async(req, res) => {
    if(req.session.authenticated) {
        await Dispatch.deleteOne({
            assigned_case: req.body.id
        })
        res.json({'status': 'OK'})
    } else res.status(401).json({'msg': 'Session expired'})
});

dispatchRoutes.route('/dispatch/getDispatchFromCase/:id').get(async(req, res) => {
    if (req.session.authenticated) {
        let dispatch = await Dispatch.findOne({
            assigned_case: req.params.id
        })
        if (dispatch) {
            res.json({dispatch: dispatch})
        } else {
            res.status(404).json({'msg': 'Dispatch not found'})
        }
    } else res.status(401).json({'msg': 'Session expired'})
})

dispatchRoutes.route('/dispatch/getETA/:id').get(async(req, res) => {
    if(req.session.authenticated) {
        const dispatch = await Dispatch.findOne({
            assigned_case: req.params.id,
            completed: false
        })
        if(dispatch) {
            const c = await Case.findOne({_id: req.params.id})
            const location = await Location.findOne({ambulance: dispatch.assigned_ambulance}).limit(1).sort({$natural:-1})
            const googleMaps = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?region=uk&units=imperial&avoid=highways&traffic_model=best_guess&departure_time=${new Date().getTime().toString()}&origins=${location.latitude}%2C${location.longitude}&destinations=${c.latitude}%2C${c.longitude}
            &key=${process.env.GOOGLE_MAPS}`)
            res.json({'eta': googleMaps.data.rows[0].elements[0].duration.text})
        } else res.status(404).json({'msg': 'Dispatch not found'})
    } else res.status(401).json({'msg': 'Session expired'})
})


module.exports = dispatchRoutes
