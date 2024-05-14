import React, { useState, useEffect } from 'react';
import contactService from './component/axxioss.jsx';
import './index.css';
import Notification from './component/alerta.jsx'
import ContactForm from './component/ContacForm.jsx';
import ContactList from './component/ListPersons.jsx';

const App = () => {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({ name: '', number: '' });
  const [editingContact, setEditingContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState(null);


useEffect(() => {
  contactService
    .getAll()
    .then(initialContacts => {
      setContacts(initialContacts);
    })
    .catch(error => {
      showNotification(`Error fetching contacts: ${error.response.data.error}`, 'error');
    });
}, []);

const showNotification = (message, type) => {
  setNotification({ message, type });
  setTimeout(() => {
    setNotification(null);
  }, 5000);
};

const handleSubmit = (event) => {
  event.preventDefault();
  
  const existingContact = contacts.find(contact => contact.name === newContact.name);

  if (existingContact) {
    const confirmUpdate = window.confirm(`the contact ${existingContact.name} already exists. ¿You want to update your phone number?`);

    if (confirmUpdate) {
      setEditingContact(existingContact);
      
      if (existingContact.number !== newContact.number) {
        const updatedContact = {
          ...existingContact,
          number: newContact.number,
        };
        contactService
          .update(existingContact.id, updatedContact)
          .then(returnedContact => {
            setContacts(contacts.map(contact => contact.id !== existingContact.id ? contact : returnedContact));
            setEditingContact(null);
            setNewContact({ name: '', number: '' });
            showNotification(`the contact ${returnedContact.name} has been updated successfully`, 'success');
          })
          .catch(error => {
            if (error.response.status === 404) {
              setContacts(contacts.filter(contact => contact.id !== existingContact.id));
              setEditingContact(null);
              setNewContact({ name: '', number: '' });
              showNotification(error.response.data.error);
              //showNotification(`El contacto ${existingContact.name} no existe.`, 'error');
            } else {
              showNotification(`${error.response.data.error}`, 'error');
            }
          });
      }
    }
  } else {
    if (editingContact) {
      const updatedContact = {
        ...editingContact,
      };

      contactService
        .update(editingContact.id, updatedContact)
        .then(returnedContact => {
          setContacts(contacts.map(contact => contact.id !== editingContact.id ? contact : returnedContact));
          setEditingContact(null);
          setNewContact({ name: '', number: '' });
          showNotification(`The contact ${returnedContact.name} has been updated successfully`, 'success');
        })
        .catch(error => {
          if (error.response.status === 404) {
            setContacts(contacts.filter(contact => contact.id !== editingContact.id));
            setEditingContact(null);
            setNewContact({ name: '', number: '' });
            showNotification(`${error.response.data.error}`, 'error');
          } else {
            showNotification(`${error.response.data.error}`, 'error');
          }
        });
    } else {
      const contactObject = {
        name: newContact.name,
        number: newContact.number,
      };

      contactService
        .create(contactObject)
        .then(returnedContact => {
          setContacts(contacts.concat(returnedContact));
          setNewContact({ name: '', number: '' });
          showNotification(`The contact ${returnedContact.name} has been added successfully`, 'success');
        })
        .catch(error => {
          if (error.response.status === 400) {
            showNotification(`${error.response.data.error}`, 'error');
            setNewContact({ name: '', number: '' });
          } else {
            showNotification(`Failed to add contact: ${error.response.data.error}`, 'error');
          }
        });
    }
  }
};

const editContact = (contact) => {
  setEditingContact(contact);
};

const handleEditInputChange = (event) => {
  const { name, value } = event.target;
  setEditingContact(prevState => ({ ...prevState, [name]: value }));
};

const handleContactChange = (event) => {
  setNewContact({ ...newContact, [event.target.name]: event.target.value });
};

const deleteContact = (id) => {
  if (window.confirm("Are you sure you want to delete this contact?")) {
    contactService
      .deleted(id)
      .then(() => {
        setContacts(contacts.filter(contact => contact.id !== id));
        showNotification(`The contact has been successfully deleted`, 'success');
      })
      .catch(error => {
        showNotification(`Failed to delete contact: ${error.response.data.error}`, 'error');
      });
  }
};

const filteredContacts = searchTerm ? contacts.filter(contact =>
  contact.name.toLowerCase().includes(searchTerm.toLowerCase())
) : contacts;

return (
  <div className="container">
    <h1>Phonebook</h1>
    <Notification notification={notification} />
    
    {/* Renderiza el componente ContactForm */}
    <ContactForm
      editingContact={editingContact}
      newContact={newContact}
      handleEditInputChange={handleEditInputChange}
      handleContactChange={handleContactChange}
      handleSubmit={handleSubmit}
    />

    <input
      className="input"
      type="text"
      placeholder="Search..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />

    {/* Renderiza el componente ContactList */}
    <ContactList
      filteredContacts={filteredContacts}
      editContact={editContact}
      deleteContact={deleteContact}
    />
  </div>
);
};

export default App;