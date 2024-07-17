import React, { useState } from "react";
import Modal from "react-modal";
import { X } from "lucide-react";
import "./cardDetailModal.scss";

const CardDetailModal = ({ isOpen, onClose, task, onUpdate, onDelete }) => {
  const [title, setTitle] = useState(task.title);
  const [startDate, setStartDate] = useState(task.startDate);
  const [startTime, setStartTime] = useState(task.startTime);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [dueTime, setDueTime] = useState(task.dueTime);
  const [description, setDescription] = useState(task.description);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comments, setComments] = useState(task.comments || []); // State to hold comments
  const [comment, setComment] = useState(""); // State to hold the comment text

  const handleSave = () => {
    onUpdate({
      ...task,
      title,
      startDate,
      startTime,
      dueDate,
      dueTime,
      description,
      comments,
    });
    onClose();
  };

  const handleCommentButton = () => {
    setShowCommentInput(!showCommentInput);
  };

  const commentSubmit = () => {
    const newComment = {
      id: comments.length + 1,
      text: comment,
    };

    console.log("Sending comment to backend:", newComment);

    setComments([...comments, newComment]);

    setComment("");
    setShowCommentInput(false);
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
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="date-time-group">
        <div className="form-group">
          <label>Starts Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Starts Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
      </div>
      <div className="date-time-group">
        <div className="form-group">
          <label>Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Due Time</label>
          <input
            type="time"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
          />
        </div>
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4} // Adjust the number of rows as needed
          style={{
            width: "100%",
            padding: "0.5rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "1rem",
          }}
          placeholder="Enter description..."
          required
        />
      </div>
      {/* Display comments */}
      {comments.length > 0 && (
        <div className="comments-section">
          <h3>Comments</h3>
          <ul>
            {comments.map((comment) => (
              <li key={comment.id}>
                <strong>(닉네임) : </strong> {comment.text}
              </li>
            ))}
          </ul>
        </div>
      )}
      {showCommentInput && (
        <div className="form-group">
          <label>Comment</label>
          <textarea
            id="new-comment"
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "1rem",
            }}
            placeholder="Enter your comment..."
            required
          />
        </div>
      )}
      {!showCommentInput && (
        <div className="modal-actions">
          <button className="comment-button" onClick={handleCommentButton}>
            Comment
          </button>
          <button onClick={handleSave}>Save</button>
          <button onClick={() => onDelete(task.id)}>Delete</button>
        </div>
      )}
      {showCommentInput && (
        <div className="modal-actions">
          <button className="comment-button" onClick={handleCommentButton}>
            Cancel
          </button>
          <button onClick={commentSubmit}>Submit</button>
          <button onClick={() => onDelete(task.id)}>Delete</button>
        </div>
      )}
    </Modal>
  );
};

export default CardDetailModal;
