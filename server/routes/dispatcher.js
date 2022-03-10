const express = require('express');
const bcrypt = require("bcrypt");

const dispatcherRoutes = express.Router()

const Dispatcher = require("../db/models/dispatcher");
const Case = require('../db/models/case');
const Dispatch = require('../db/models/dispatch');


dispatcherRoutes.route('/api/dispatcher/login').post(async (req, res) => {
    const { username, password } = req.body
    if (username && password) {
      if (req.session.authenticated) {
        res.json(req.session);
      } else {
          Dispatcher.findOne({username: username}, (err, record) => {
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
});

dispatcherRoutes.route('/api/dispatcher/logout').post((req, res) => {
  req.session.destroy()
  res.json({success: true})
})

dispatcherRoutes.route('/api/dispatcher/checkSession').get((req, res) => {
  if (req.session.authenticated) {
    res.json(req.session)
  } else {
    res.status(401).json({'msg': "Session expired"})
  }
});

dispatcherRoutes.route('/api/dispatcher/getTodayCases').get(async(req, res) => {
  if (req.session.authenticated) {
      const user = req.session.user_id;
      let cases = []
      const today = new Date()
      let count = 0

      Dispatcher.findOne({_id: user}, (err, record) => {
          if (err) {
              res.status(500).json({'msg': "Internal server error"})
          } else {
              cases = record.cases
              for (let i = 0; i < cases.length; i++) {
                  timestamp = cases[i].toString().substring(0,8)
                  date = new Date(parseInt(timestamp, 16) * 1000)
                  if (today.toDateString() === date.toDateString()) {
                      count += 1
                  }
              }
              res.json({count})
          }
      });
  } else {
      res.status(401).json({'msg': "Session expired"})
  }
});

dispatcherRoutes.route('/api/dispatcher/getRecentCases').get(async (req, res) => {
  if (req.session.authenticated) {
    const user = req.session.user_id;
    let cases = [];
    let response = []
    let ptr = 0

    await Dispatcher.findOne({_id: user})
      .then((result) => {
        cases = result.cases
      })

  for(let i=cases.length-1; i >= 0; i--) {
    if (ptr == 9) break
    await Case.findOne({_id: cases[i]})
      .then((record) => {
        if (record) {
          response.push({
            id: record._id,
            patient: `${record.first_name} ${record.surname}`,
            category: record.category,
          })
        }
      });
      ptr += 1
    }


  res.json({cases: response})

  } else {
    res.status(401).json({'msg': "Session expired"})
  }
});

dispatcherRoutes.route('/api/dispatcher/getPendingDispatches').get(async(req, res) => {
  if (req.session.authenticated) {
    const user = req.session.user_id;
    let cases = []
    let count = 0

    await Dispatcher.findOne({_id: user})
    .then((result) => {
      cases = result.cases
    })

    for(let i=0; i <= cases.length; i++) {
      await Dispatch.findOne({assigned_case: cases[i], assigned_ambulance: null})
        .then((result) => {
          if(result) count += 1
        })
    }

    res.json({count: count})
  } else {
    res.status(401).json({'msg': "Session expired"})
  }
})


dispatcherRoutes.route('/api/dispatcher/getInProgressDispatches').get(async(req, res) => {
  if (req.session.authenticated) {
    const user = req.session.user_id;
    let cases = []
    let count = 0

    await Dispatcher.findOne({_id: user})
    .then((result) => {
      cases = result.cases
    })

    for(let i=0; i <= cases.length; i++) {
      await Dispatch.findOne({assigned_case: cases[i]})
        .then((result) => {
          if(result.assigned_ambulance) count += 1
        })
        .catch((err) => {;})
    }

    res.json({count: count})
  } else {
    res.status(401).json({'msg': "Session expired"})
  }
})

dispatcherRoutes.route('/api/dispatcher/getSettings').get(async(req, res) => {
  if (req.session.authenticated) {
    const userID = req.session.user_id;
    const user = await Dispatcher.findOne({_id: userID})

    res.json({'username': user.username, 'firstName': user.first_name, 'surname': user.surname})
  } else {
    res.status(401).json({'msg': 'Session expired'})
  }
})

dispatcherRoutes.route('/api/dispatcher/updatePassword').put(async(req, res) => {
  if (req.session.authenticated) {
    const user = await Dispatcher.findOne({_id: req.session.user_id})
    let correctPassword = bcrypt.compareSync(req.body.currentPassword, user.password)
    if (correctPassword) {
      if (req.body.newPassword == req.body.confirmNewPassword) {
        await Dispatcher.updateOne(
          {
            _id: req.session.user_id
          },
          {
            password: bcrypt.hashSync(req.body.newPassword, 10)
          }
        )

        res.json({'success': true})
      } else {
        res.status(406).json({'msg': 'Passwords do not match'})
      }
    } else {
      res.status(403).json({'msg': 'Invalid Password'})
    }
  }
  else {
    res.status(401).json({'msg': 'Session expired'})
  }
})



module.exports = dispatcherRoutes