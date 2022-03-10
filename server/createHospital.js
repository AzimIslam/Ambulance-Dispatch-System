const dbo = require("./db/conn");
const Hospital = require("./db/models/hospital");

dbo.connectToServer(function (err) {
    if (err) throw err
});


let obj = {
    hospital_name: "St Mary's Hospital",
    address1: "Praed Street",
    city: "London",
    postcode: "W2 1NY"
}

Hospital.create(obj, (err) => {
    if (err) throw err
    console.log("Hospital successfully created")
})