import React, { useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import Button from '../Button/Button';
import LinkItem from '../LinkItem/LinkItem';
import AddLinkForm from '../AddLinkForm/AddLinkForm';
import './Category.css';

const Category = ({ category, onAddLink, onDeleteLink, onDeleteCategory }) => {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="category">
      <div className="category-header">
        <h2 className="category-title">{category.title}</h2>
        <div className="category-actions">
          <Button 
            variant="icon-only" 
            onClick={() => setShowAddForm(!showAddForm)}
            icon={<FaPlus />}
            size="small"
          />
          <Button 
            variant="icon-only" 
            onClick={() => onDeleteCategory(category.id)}
            icon={<FaTrash />}
            size="small"
            className="delete-category-btn"
          />
        </div>
      </div>
      
      {showAddForm && (
        <AddLinkForm 
          categoryId={category.id} 
          onAddLink={onAddLink} 
          onCancel={() => setShowAddForm(false)} 
        />
      )}
      
      <div className="links-container">
        {category.links && category.links.map((link, index) => (
          <LinkItem 
            key={`${category.id}-${index}`} 
            link={link} 
            categoryId={category.id}
            onDelete={onDeleteLink}
          />
        ))}
      </div>
    </div>
  );
};

export default Category;