import React from 'react';

const ContactForm = ({
  editingContact,
  newContact,
  handleEditInputChange,
  handleContactChange,
  handleSubmit,
}) => {
  return (
    <form className="form" onSubmit={handleSubmit}>
      <input
        className="input"
        name="name"
        value={editingContact ? editingContact.name : newContact.name}
        onChange={editingContact ? handleEditInputChange : handleContactChange}
        placeholder="Name"
      />
      <input
        className="input"
        name="number"
        value={editingContact ? editingContact.number : newContact.number}
        onChange={editingContact ? handleEditInputChange : handleContactChange}
        placeholder="Number"
      />
      <button className="button" type="submit">
        {editingContact ? 'Update' : 'Save'}
      </button>
    </form>
  );
};

export default ContactForm;
