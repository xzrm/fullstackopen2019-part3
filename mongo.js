/* Part of Exercise 3.12:
 command-line args:
          node mongo.js yourpassword Anna 040-1234556
 expected output:
          added Anna number 040-1234556 to phonebook &
          list of other entries
*/

const mongoose = require('mongoose')

const password = process.argv[2]

const url =
  `mongodb+srv://new-user_04:${password}@cluster0-nqxxg.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 4) {
  Person
    .find({})
    .then(persons => {
      console.log('phonebook: \n')
      persons.map(person => {
        console.log(person.name, person.number)
      })
      mongoose.connection.close()
    }
    )
}
else {
  const personToAdd = process.argv[3]
  const numberToAdd = process.argv[4]
  const personObj = new Person({
    name: personToAdd,
    number: numberToAdd,
  })
  personObj.save().then(response => {
    console.log('person saved!')
    mongoose.connection.close()
  })
}


