var server = require('supertest');
const Ambulance = require('../db/models/ambulance');
const Dispatcher = require('../db/models/dispatcher');
const Location = require('../db/models/location')
const Hospital = require('../db/models/hospital');
const Dispatch = require('../db/models/dispatch');
const Case = require('../db/models/case');
const bcrypt = require('bcrypt');

var should = require('chai').should();
var app = require('../server');
var request = require('superagent');

// When running these tests please switch to the test database

describe("Dispatcher", function() {
    it("Renders log in page", function(done){
        server(app)
        .get('/dispatcher/')
        .end(function(err, res){
            if(err) done(err);
            res.status.should.equals(200);
            done();
        });
    });

    it("Log in to application", function(done) {
        let testDispatcherData = {
            first_name: "Test",
            surname: "User",
            username: "testdispatcher01",
            password: bcrypt.hashSync("test123", 10)
        }
        let testDispatcher = new Dispatcher(testDispatcherData)
        testDispatcher.save((err, dispatcher) => {
            const user = request.agent()
            user.post('http://localhost:5000/api/dispatcher/login')
            .send({username: "testdispatcher01", password: "test123"})
            .end(function(err, res) {
                if(err) done(err)
                user.get('http://localhost:5000/api/dispatcher/checkSession')
                .end(function(err, res2) {
                    if (err) done(err)
                    res2.body.authenticated.should.equals(true)
                    Dispatcher.deleteOne({_id: dispatcher._id}, () => {
                        done()
                    })
                })
            })
        })
    })

    it("Log out of application", function(done) {
        let testDispatcherData = {
            first_name: "Test",
            surname: "User",
            username: "testdispatcher01",
            password: bcrypt.hashSync("test123", 10)
        }
        let testDispatcher = new Dispatcher(testDispatcherData)
        testDispatcher.save((err, dispatcher) => {
            const user = request.agent()
            user.post('http://localhost:5000/api/dispatcher/login')
            .send({username: "testdispatcher01", password: "test123"})
            .end(function(err, res) {
                user.get('http://localhost:5000/api/dispatcher/checkSession')
                .end(function(err, res2) {
                    res2.body.authenticated.should.equals(true)
                    user.post('http://localhost:5000/api/dispatcher/logout')
                    .end(function(err, res3) {
                        user.get('http://localhost:5000/api/dispatcher/checkSession')
                        .end(function(err, res4) {
                            res4.status.should.equals(401)
                            Dispatcher.deleteOne({_id: dispatcher._id}, () => {
                                done()
                            })
                        })
                    })
                })
            })
        })
    })
    
    it("Create a case", function(done) {
        let testDispatcherData = {
            first_name: "Test",
            surname: "User",
            username: "testdispatcher01",
            password: bcrypt.hashSync("test123", 10)
        }
        let testDispatcher = new Dispatcher(testDispatcherData)

        testDispatcher.save((err, dispatcher) => { 
            let testCData = {
                first_name: "John",
                surname: "Smith",
                notes: "Patient is slightly dizzy",
                category: 4,
                longitude: -0.1297604,
                latitude: 51.5940573,
                symptoms: ["Back Pain - associated with an accident (e.g. fall, MVA, lifting) provided the patient has no loss of feeling or function in a limb and no loss of bladder or bowel control."]
            }
            const user = request.agent()
            user.post('http://localhost:5000/api/dispatcher/login')
            .send({username: "testdispatcher01", password: "test123"})
            .end((err, res) => {
                user.post('http://localhost:5000/case/create')
                .send(testCData)
                .end((err, res) => {
                    if (err) done(err)
                    res.status.should.equals(200)
                    Case.deleteOne({_id: res.body.id}, () => {
                        Dispatcher.deleteOne({_id: dispatcher._id}, () => {
                            done()
                        })
                    })
                })
            })
        })
    })

    it("Get Details of a Case", function(done) {
        let testDispatcherData = {
            first_name: "Test",
            surname: "User",
            username: "testdispatcher01",
            password: bcrypt.hashSync("test123", 10)
        }
        let testDispatcher = new Dispatcher(testDispatcherData)

        testDispatcher.save((err, dispatcher) => { 
            let testCData = {
                first_name: "John",
                surname: "Smith",
                notes: "Patient is slightly dizzy",
                category: 4,
                longitude: -0.1297604,
                latitude: 51.5940573,
                symptoms: ["Back Pain - associated with an accident (e.g. fall, MVA, lifting) provided the patient has no loss of feeling or function in a limb and no loss of bladder or bowel control."]
            }
            const user = request.agent()
            user.post('http://localhost:5000/api/dispatcher/login')
            .send({username: "testdispatcher01", password: "test123"})
            .end((err, res) => {
                user.post('http://localhost:5000/case/create')
                .send(testCData)
                .end((err, res2) => {

                    user.get(`http://localhost:5000/case/getDetails/${res2.body.id}`)
                    .end((err, res3) => {
                        res3.status.should.equals(200)
                        let c = Case.findOne({_id: res3.body.case._id})
                        c.should.not.equals(undefined)
                        Case.deleteOne({_id: res2.body.id}, () => {
                            Dispatcher.deleteOne({_id: dispatcher._id}, () => {
                                done()
                            })
                        })
                    })  
                })
            })
        })
    })

    it("Create Dispatch", function(done) {
        let testDispatcherData = {
            first_name: "Test",
            surname: "User",
            username: "testdispatcher01",
            password: bcrypt.hashSync("test123", 10)
        }
        let testDispatcher = new Dispatcher(testDispatcherData)

        testDispatcher.save((err, dispatcher) => { 
            let testCData = {
                first_name: "John",
                surname: "Smith",
                notes: "Patient is slightly dizzy",
                category: 4,
                longitude: -0.1297604,
                latitude: 51.5940573,
                symptoms: ["Back Pain - associated with an accident (e.g. fall, MVA, lifting) provided the patient has no loss of feeling or function in a limb and no loss of bladder or bowel control."]
            }
            const user = request.agent()
            
            user.post('http://localhost:5000/api/dispatcher/login')
            .send({username: "testdispatcher01", password: "test123"})
            .end((err, res) => {
                user.post('http://localhost:5000/case/create')
                .send(testCData)
                .end((err, res) => {
                    if (err) done(err)
                    res.status.should.equals(200)
                    user.post('http://localhost:5000/dispatch/create')
                    .send({case: res.body.id})
                    .end((err, res2) => {
                        res2.status.should.equals(200)
                        Dispatch.deleteOne({assigned_case: res.body.id}, () => {
                            Case.deleteOne({_id: res.body.id}, () => {
                                Dispatcher.deleteOne({_id: dispatcher._id}, () => {
                                    done()
                                })
                            })
                        })
                    })
                })
            })
        })
    })

    it("Cancel Dispatch", function(done) {
        let testDispatcherData = {
            first_name: "Test",
            surname: "User",
            username: "testdispatcher01",
            password: bcrypt.hashSync("test123", 10)
        }
        let testDispatcher = new Dispatcher(testDispatcherData)

        testDispatcher.save((err, dispatcher) => {
            let testCData = {
                first_name: "John",
                surname: "Smith",
                notes: "Patient is slightly dizzy",
                category: 4,
                longitude: -0.1297604,
                latitude: 51.5940573,
                symptoms: ["Back Pain - associated with an accident (e.g. fall, MVA, lifting) provided the patient has no loss of feeling or function in a limb and no loss of bladder or bowel control."]
            }
            const user = request.agent()

            user.post('http://localhost:5000/api/dispatcher/login')
            .send({username: "testdispatcher01", password: "test123"})
            .end((err, res) => {
                user.post('http://localhost:5000/case/create')
                .send(testCData)
                .end((err2, res2) => {
                    user.post('http://localhost:5000/dispatch/create')
                    .send({case: res2.body.id})
                    .end((err3, res3) => {
                        user.delete('http://localhost:5000/dispatch/delete')
                        .send({id: res2.body.id})
                        .end((err4, res4) => {
                            res4.body.status.should.equals('OK')
                                Case.deleteOne({_id: res.body.id}, () => {
                                    Dispatcher.deleteOne({_id: dispatcher._id}, () => {
                                        done()
                                    })
                                })
                        })
                    })
                })
            })
        })
    })
});

describe("Ambulance", function() {
    it("Renders log in page", function(done) {
        server(app)
        .get('/ambulance/')
        .end(function(err, res) {
            if (err) done(err)
            res.status.should.equals(200);
            done();
        })
    }),

    it("Log in to application", function(done) {
        let testHospitalData  = {
            hospital_name: "Hospital 1",
            address1: "Praed Street",
            city: "London",
            postcode: "W2 1NY"
        }
        let testHospital = new Hospital(testHospitalData)
        testHospital.save((err, hospital) => {
            let testAmbulanceData = {
                first_name: "Ambulance",
                surname: "Driver",
                username: "ambulancetest",
                password: bcrypt.hashSync("atest01", 10),
                hospital: hospital._id
            }
            let testAmbulance = new Ambulance(testAmbulanceData)
            testAmbulance.save((err, ambulance) => {
                const user = request.agent()
                user.post('http://localhost:5000/api/ambulance/login')
                    .send({username: "ambulancetest", password: "atest01"})
                    .end(function(err, res) {
                        res.status.should.equals(200);
                        user.get('http://localhost:5000/api/ambulance/checkSession')
                        .end(function(err, res) {
                            if (err) done(err)
                            res.body.authenticated.should.equals(true);
                            Ambulance.deleteOne({_id: ambulance._id}, () => {
                                Hospital.deleteOne({_id: hospital._id}, () => {
                                    done()
                                })
                            })
                        })
                    })
            })
        })
    })

    it('Log out of application', function(done) {
        let testHospitalData  = {
            hospital_name: "Hospital 1",
            address1: "Praed Street",
            city: "London",
            postcode: "W2 1NY"
        }
        let testHospital = new Hospital(testHospitalData)
        testHospital.save((err, hospital) => {
            let testAmbulanceData = {
                first_name: "Ambulance",
                surname: "Driver",
                username: "ambulancetest",
                password: bcrypt.hashSync("atest01", 10),
                hospital: hospital._id
            }
            let testAmbulance = new Ambulance(testAmbulanceData)
            testAmbulance.save((err, ambulance) => {
                const user = request.agent()
                user.post('http://localhost:5000/api/ambulance/login')
                    .send({username: "ambulancetest", password: "atest01"})
                    .end(function(err, res) {
                        res.status.should.equals(200);
                        user.get('http://localhost:5000/api/ambulance/checkSession')
                        .end(function(err, res) {
                            if (err) done(err)
                            res.body.authenticated.should.equals(true);
                            user.post("http://localhost:5000/api/ambulance/logout")
                            .end(function(err, res) {
                                user.get('http://localhost:5000/api/ambulance/checkSession')
                                .end(function(err, res) {
                                    res.status.should.equals(401)
                                    Ambulance.deleteOne({_id: ambulance._id}, () => {
                                        Hospital.deleteOne({_id: hospital._id}, () => {
                                            done()
                                        })
                                    })
                                })
                            })
                        })
                    })
            })
        })
    })
    it("Send location to database", function(done) {
        let testHospitalData  = {
            hospital_name: "Hospital 1",
            address1: "Praed Street",
            city: "London",
            postcode: "W2 1NY"
        }
        let testHospital = new Hospital(testHospitalData)
        testHospital.save((err, hospital) => {
            let testAmbulanceData = {
                first_name: "Ambulance",
                surname: "Driver",
                username: "ambulancetest",
                password: bcrypt.hashSync("atest01", 10),
                hospital: hospital._id
            }
            let testAmbulance = new Ambulance(testAmbulanceData)
            testAmbulance.save((err, ambulance) => {
                const user = request.agent()
                user.post('http://localhost:5000/api/ambulance/login')
                .send({username: 'ambulancetest', password: "atest01"})
                .end(function(err, res) {
                    res.body.authenticated.should.equals(true);
                    user.post('http://localhost:5000/location/send')
                    .send({lng: -0.046230, lat: 51.521870})
                    .end(function(err, res) {
                        res.status.should.equals(200)
                        Location.deleteOne({_id: res.body.location_id}, () => {
                            Ambulance.deleteOne({_id: ambulance._id}, () => {
                                Hospital.deleteOne({_id: hospital._id}, () => {
                                    done()
                                })
                            })
                        })
                    })
                })
            })
        })
    })
    it("Assign Ambulance to Dispatch", function(done) {
        let testHospitalData  = {
            hospital_name: "Hospital 1",
            address1: "Praed Street",
            city: "London",
            postcode: "W2 1NY"
        }
        let testHospital = new Hospital(testHospitalData)
        testHospital.save((err, hospital) => {
            let testAmbulanceData = {
                first_name: "Ambulance",
                surname: "Driver",
                username: "ambulancetest",
                password: bcrypt.hashSync("atest01", 10),
                hospital: hospital._id
            }
            let testAmbulance = new Ambulance(testAmbulanceData)
            testAmbulance.save((err, ambulance) => {
                let testCaseData = {
                    first_name: "John",
                    surname: "Smith",
                    notes: "Storm in area",
                    category: 1,
                    longitude: -0.1297604,
                    latitude: 51.5940573,
                    symptoms: ["Suspected spinal injury"]
                }

                let testCase = new Case(testCaseData)
                testCase.save((err, c) => {
                    let testDispatchData = {
                        assigned_case: c._id,
                        completed: false
                    }
                    let testDispatch = new Dispatch(testDispatchData)
                    testDispatch.save((err, dispatch) => {
                        const user = request.agent()
                        user.post('http://localhost:5000/api/ambulance/login')
                        .send({username: 'ambulancetest', password: "atest01"})
                        .end(function(err, res) {
                            res.body.authenticated.should.equals(true);
                            user.put('http://localhost:5000/dispatch/assignAmbulance')
                            .send({assigned_case: c._id, assigned_ambulance: ambulance._id})
                            .end(function(err, res)  {
                                res.status.should.equals(200)
                                Ambulance.deleteOne({_id: ambulance._id}, () => {
                                    Hospital.deleteOne({_id: hospital._id}, () => {
                                        Dispatch.deleteOne({assigned_case: c._id}, () => {
                                            Case.deleteOne({_id: c._id}, () => {
                                                done()
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })

    it("Mark Dispatch as Completed", function(done) {
        let testHospitalData  = {
            hospital_name: "Hospital 1",
            address1: "Praed Street",
            city: "London",
            postcode: "W2 1NY"
        }
        let testHospital = new Hospital(testHospitalData)
        testHospital.save((err, hospital) => {
            let testAmbulanceData = {
                first_name: "Ambulance",
                surname: "Driver",
                username: "ambulancetest",
                password: bcrypt.hashSync("atest01", 10),
                hospital: hospital._id
            }
            let testAmbulance = new Ambulance(testAmbulanceData)
            testAmbulance.save((err, ambulance) => {
                let testCaseData = {
                    first_name: "John",
                    surname: "Smith",
                    notes: "Storm in area",
                    category: 1,
                    longitude: -0.1297604,
                    latitude: 51.5940573,
                    symptoms: ["Suspected spinal injury"]
                }

                let testCase = new Case(testCaseData)
                testCase.save((err, c) => {
                    let testDispatchData = {
                        assigned_case: c._id,
                        completed: false
                    }
                    let testDispatch = new Dispatch(testDispatchData)
                    testDispatch.save((err, dispatch) => {
                        const user = request.agent()
                        user.post('http://localhost:5000/api/ambulance/login')
                        .send({username: 'ambulancetest', password: "atest01"})
                        .end(function(err, res) {
                            res.body.authenticated.should.equals(true);
                            user.put('http://localhost:5000/dispatch/assignAmbulance')
                            .send({assigned_case: c._id, assigned_ambulance: ambulance._id})
                            .end((err, res2) => {
                                user.put('http://localhost:5000/dispatch/markComplete')
                                .send({case: c._id})
                                .end(function(err, res) {
                                    res.body.status.should.equals('OK')
                                    Ambulance.deleteOne({_id: ambulance._id}, () => {
                                        Hospital.deleteOne({_id: hospital._id}, () => {
                                            Dispatch.deleteOne({assigned_case: c._id}, () => {
                                                Case.deleteOne({_id: c._id}, () => {
                                                    done()
                                                    setInterval(() => {
                                                        process.exit(1)
                                                    }, 1000)
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })
})


