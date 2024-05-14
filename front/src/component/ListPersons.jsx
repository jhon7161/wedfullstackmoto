import React from 'react';

const ContactList = ({ filteredContacts, editContact, deleteContact }) => {
  return (
    <table className="contact-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Number</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredContacts.map(contact =>
          contact && (
            <tr key={contact.id}>
              <td>{contact.name}</td>
              <td>{contact.number}</td>
              <td>
                <button className="button" onClick={() => editContact(contact)}>
                  Edit
                </button>
                <button className="button" onClick={() => deleteContact(contact.id)}>
                  Delete
                </button>
              </td>
            </tr>
          )
        )}
      </tbody>
    </table>
  );
};

export default ContactList;
