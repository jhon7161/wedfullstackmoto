require('dotenv').config();
const mongoose = require('mongoose');

const password = process.env.DB_PASSWORD;
const name = process.argv[3];
const number = process.argv[4];
const userPassword = process.argv[2];

const url = `mongodb+srv://desarrollador19jhon:${password}@appphonebook.qaaig53.mongodb.net/sample_airbnb`;

mongoose.connect(url)
  .then(() => console.log('Conexión a MongoDB exitosa!'))
  .catch(error => console.error('Error conectando a MongoDB:', error));

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  password: String,
});

const Person = mongoose.model('Person', personSchema);

// Validaciones
if (!name || typeof name !== 'string') {
  console.error('El nombre proporcionado no es válido');
  process.exit(1);
}

if (!number || typeof number !== 'string') {
  console.error('El número proporcionado no es válido');
  process.exit(1);
}

if (!userPassword || typeof userPassword !== 'string') {
  console.error('La contraseña proporcionada no es válida');
  process.exit(1);
}

if (process.argv.length < 5) {
  Person.find({}).then((result) => {
    console.log('phonebook:');
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
} else {
  const person = new Person({
    name: name,
    number: number,
    password: userPassword,
  });

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
}
