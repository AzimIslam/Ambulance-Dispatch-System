
const dbo = require("./db/conn");
const Ambulance = require("./db/models/ambulance");
const bcrypt = require('bcrypt');
const { ObjectId } = require("bson");

dbo.connectToServer(function (err) {
    if (err) throw err
})

let obj = {
    first_name: "Azim",
    surname: "Islam",
    username: "eey183",
    password: bcrypt.hashSync("AIslam", 10),
    hospital: ObjectId("61ed4c56979b61e9257b2b0c")
}

Ambulance.create(obj, (err) => {
    if (err) throw err
    console.log("Ambulance successfully created")
})