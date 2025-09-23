import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import Button from '../Button/Button';
import './AddLinkForm.css';

const AddLinkForm = ({ categoryId, onAddLink, onCancel }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && url.trim()) {
      onAddLink(categoryId, name, url);
      setName('');
      setUrl('');
      onCancel();
    }
  };

  return (
    <form className="add-link-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h3>Add New Link</h3>
        <Button 
          variant="icon-only" 
          onClick={onCancel}
          icon={<FaTimes />}
          size="small"
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Link name"
          className="form-input"
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="URL (e.g., google.com)"
          className="form-input"
        />
      </div>
      <div className="form-actions">
        <Button 
          variant="secondary" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          variant="primary" 
          type="submit"
        >
          Add Link
        </Button>
      </div>
    </form>
  );
};

export default AddLinkForm;