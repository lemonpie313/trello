import React, { useState, useEffect } from 'react';
import { getBoards, createBoard } from '../services/BoardService';
import { useNavigate } from 'react-router-dom';
import './Workspace.css';

const Workspace = () => {
  const [boards, setBoards] = useState([]);
  const [newBoardName, setNewBoardName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBoards = async () => {
      const boardsData = await getBoards();
      setBoards(boardsData);
    };

    fetchBoards();
  }, []);

  const handleCreateBoard = async () => {
    if (newBoardName) {
      await createBoard({ name: newBoardName });
      setNewBoardName('');
      const boardsData = await getBoards();
      setBoards(boardsData);
    }
  };

  return (
    <div className="workspace-container">
      <h2>Workspace</h2>
      <div className="create-board">
        <input
          type="text"
          placeholder="New Board Name"
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
        />
        <button onClick={handleCreateBoard}>Create Board</button>
      </div>
      <div className="boards">
        {boards.map((board) => (
          <div
            key={board.id}
            className="board"
            onClick={() => navigate(`/board/${board.id}`)}
          >
            {board.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Workspace;
