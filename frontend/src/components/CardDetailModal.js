import React, { useState } from 'react';
import Modal from 'react-modal';
import { X } from 'lucide-react';
import './cardDetailModal.scss';

const CardDetailModal = ({ isOpen, onClose, task, onUpdate, onDelete }) => {
  const [title, setTitle] = useState(task.title);
  const [date, setDate] = useState(task.date);

  const handleSave = () => {
    onUpdate({ ...task, title, date });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Card Detail"
      className="card-detail-modal"
      overlayClassName="overlay"
    >
      <button className="close-button" onClick={onClose}>
        <X size={24} />
      </button>
      <h2>Card Detail</h2>
      <div className="form-group">
        <label>Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div className="modal-actions">
        <button onClick={handleSave}>Save</button>
        <button onClick={() => onDelete(task.id)}>Delete</button>
      </div>
    </Modal>
  );
};

export default CardDetailModal;
