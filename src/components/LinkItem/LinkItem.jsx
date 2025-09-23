import React from 'react';
import { FaExternalLinkAlt, FaTrash } from 'react-icons/fa';
import Button from '../Button/Button';
import './LinkItem.css';

const LinkItem = ({ link, categoryId, onDelete }) => {
  const handleDelete = () => {
    onDelete(categoryId, link);
  };

  const handleClick = (e) => {
    e.preventDefault();
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="link-item">
      <a 
        href={link.url} 
        onClick={handleClick}
        className="link-content"
      >
        <FaExternalLinkAlt className="link-icon" />
        <span className="link-name">{link.name}</span>
      </a>
      <Button 
        variant="icon-only" 
        onClick={handleDelete}
        icon={<FaTrash />}
        size="small"
        className="delete-link-btn"
      />
    </div>
  );
};

export default LinkItem;