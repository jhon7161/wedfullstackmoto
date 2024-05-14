require('dotenv').config();
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const Person = require('./models/urlmongo.js');
const punycode = require('punycode/');

 

const distPath = path.join(__dirname, 'front/dist');


app.use(express.static(distPath));
app.use(cors({}));
app.use(express.json());


morgan.token('body', function (req, res) { return JSON.stringify(req.body) });
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons);
    }).catch(error => {
        console.error('Error getting persons:', error);
        response.status(500).json({ error: 'An internal server error occurred' });
    });
});

  app.post('/api/persons', (request, response) => {
    const body = request.body;

    // Validar que el campo 'name' esté presente
    if (body.name === undefined) {
        return response.status(400).json({ error: 'content missing' });
    }

    // Crear una nueva instancia de Persona con los datos recibidos
    const person = new Person({
        name: body.name,
        number: body.number
    });

    // Guardar la nueva persona en la base de datos
    person.save()
        .then(savedPerson => {
            response.json(savedPerson); // Enviar la persona guardada como respuesta
        })
        .catch(error => {
            // Manejar errores de validación u otros errores
            if (error.name === 'ValidationError') {
                // Mongoose ValidationError: capturar errores de validación
                const validationErrors = Object.values(error.errors).map(err => err.message);
                return response.status(400).json({ error: validationErrors });
            } else {
                // Otros errores
                console.error('Error al guardar la persona:', error);
                return response.status(500).json({ error: 'Ocurrió un problema al guardar la persona' });
            }
        });
});

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
      .then(person => {
          if (person) {
              response.json(person);
          } else {
              response.status(404).end();
          }
      })
      .catch(error => next(error));
});

// Modificar el manejo de la ruta /info
app.get('/info', (request, response) => {
  Person.countDocuments({})
      .then(count => {
          response.send(`<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`);
      })
      .catch(error => {
          console.error('Error getting count:', error);
          response.status(500).json({ error: 'An internal server error occurred' });
      });
});
  app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(error => next(error))
  })
  app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body;

    const person = {
        name: body.name,
        number: body.number,
    };

    Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true })
        .then(updatedPerson => {
            if (!updatedPerson) {
                // Si no se encontró la persona con el ID especificado
                return response.status(404).json({ error: 'The contact does not exist' });
            }
            response.json(updatedPerson);
        })
        .catch(error => {
            if (error.name === 'ValidationError') {
                const validationErrors = Object.values(error.errors).map(err => err.message);
                return response.status(400).json({ error: validationErrors });
            } else {
                console.error('Error updating person:', error);
                return response.status(500).json({ error: 'An error occurred while updating the person' });
            }
        });
});
  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  

  app.use(unknownEndpoint)
  
const errorHandler = (error, request, response, next) => {
    console.error(error.message);
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    }
    next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});