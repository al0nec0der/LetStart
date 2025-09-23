import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import Button from '../Button/Button';
import './AddCategoryForm.css';

const AddCategoryForm = ({ onAddCategory }) => {
  const [title, setTitle] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onAddCategory(title);
      setTitle('');
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="add-category-trigger">
        <Button 
          variant="primary" 
          onClick={() => setIsOpen(true)}
          icon={<FaPlus />}
        >
          Add Category
        </Button>
      </div>
    );
  }

  return (
    <div className="add-category-form-container">
      <form className="add-category-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter category name"
          className="category-input"
          autoFocus
        />
        <div className="form-actions">
          <Button 
            variant="secondary" 
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            type="submit"
          >
            Add
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddCategoryForm;