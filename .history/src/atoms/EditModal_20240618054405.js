// MXForm.js
import React, { useState } from 'react';
import { Modal, Box, Button, TextField } from '@mui/material';
import EditModal from './EditModal'; // Assuming EditModal is in the same directory

function MXForm({ id, onRegistrationSuccess }) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // State to hold the selected user for editing

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleSaveEdit = (editedData) => {
    // Handle saving edited data (e.g., update Firestore document)
    console.log('Saving edited data:', editedData);
    // Example: Update Firestore document with editedData
    setEditModalOpen(false);
  };

  return (
    <div>
      {/* Your existing form or registration component */}
      <button onClick={() => handleEdit(user)}>Edit User</button>
      
      {/* Render EditModal */}
      {selectedUser && (
        <EditModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSave={handleSaveEdit}
          data={selectedUser}
        />
      )}
    </div>
  );
}

export default MXForm;
