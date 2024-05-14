import axios from 'axios';

const baseUrl = 'api/persons'

// Obtener todos los contactos del servidor
const getAll = () => {
  return axios.get(baseUrl)
    .then(response => response.data);
};

// Obtener un contacto por ID del servidor
const get = (id) => {
  return axios.get(`${baseUrl}/${id}`)
    .then(response => response.data);
};

// Añadir un nuevo contacto al servidor
const create = (newContact) => {
  return axios.post(baseUrl, newContact)
    .then(response => response.data);
};

// Actualizar un contacto existente en el servidor
const update = (id, updatedContact) => {
  return axios.put(`${baseUrl}/${id}`, updatedContact)
  .then(response => response.data);
};


// Eliminar un contacto del servidor
const deleted = (id) => {
  return axios.delete(`${baseUrl}/${id}`)
    .then(response => response.data);
};

export default{ getAll, get, create, update, deleted };
