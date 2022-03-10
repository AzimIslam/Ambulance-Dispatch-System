
const dbo = require("./db/conn");
const Dispatcher = require("./db/models/dispatcher");
const bcrypt = require('bcrypt')

dbo.connectToServer(function (err) {
    if (err) throw err
  })

  const hashPassword = async (password, saltRounds = 10) => {
    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(saltRounds);

        // Hash password
        return await bcrypt.hash(password, salt);
    } catch (error) {
        console.log(error);
    }

    // Return null if error
    return null;
};

let obj = {
    first_name: "Azim",
    surname: "Islam",
    username: "ec19205",
    password: bcrypt.hashSync("AIslam", 10)
}
Dispatcher.create(obj, (err) => {
    if (err) throw err
    console.log("User successfully created")
})