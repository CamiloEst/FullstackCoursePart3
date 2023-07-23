const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("connecting to database");

mongoose
  .connect(url)

  .then((result) => {
    console.log("connected to MongoDB: ", url);
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type:String,
    minLength: 3,
    require: true
  },
  number: {
    type:String,
    minLength: 8,
    required: true,
    validate: {validator: (v) =>  /([0-9]{2}-[0-9]{6,})|([0-9]{3}-[0-9]{5,})/.test(v) ,message: "Incorrect format, format must be follow: ##-six or more digits or ###-five or more digits"}
  }
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
