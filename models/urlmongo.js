require('dotenv').config();
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const url = process.env.DB_URLL;

mongoose.connect(url)
  .then(() => console.log('Connection to MongoDB successful!'))
  .catch(error => console.error('Error conectando a MongoDB:', error));
  
    const personSchema = new mongoose.Schema({
      name: {
        type: String,
        required: true,
        validate: {
          validator: function(v) {
            // Contar los espacios como parte del nombre y verificar longitud mínima
            return v.replace(/\s/g, '').length >= 3;
          },
          message: props => `${props.value} must be at least 3 characters`
        }
      },
    number: {
      type: String,
      required: true,
      minlength: 8,
      validate: {
        validator: function(value) {
          // Validar el formato del número de teléfono
          return /^\d{2,3}-\d+$/.test(value);
        },
      }
    }
  });
  


  personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })
  
 
  module.exports = mongoose.model('Person',personSchema)