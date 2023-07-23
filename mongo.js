const mongoose = require('mongoose')

const password = process.argv[2]

const url = `mongodb+srv://phonebook:${password}@cluster0.xmr6rxh.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const showAll = () => {
  Person.find({}).then((persons) => {
    console.log('phonebook:')
    persons.forEach((p) => console.log(p.name, p.number))
    mongoose.connection.close()
  })
}

const savePerson = () => {
  const newPerson = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  newPerson.save().then((person) => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
}

switch (process.argv.length) {
case 3:
  showAll()
  break
case 5:
  savePerson()
  break
default:
  console.log('A password must be given, or new person info is incomplete (name, phone)')
  process.exit(1)
}
