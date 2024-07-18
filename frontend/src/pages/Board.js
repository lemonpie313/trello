import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { PlusCircle, Edit2, Trash2 } from 'lucide-react';
import CardDetailModal from '../components/CardDetailModal';
import '../pages/Board.scss';
import axios from 'axios';

const initialColumns = {
  'Doing': {
    id: 'Doing',
    title: 'Doing',
    tasks: [
      { id: '1', title: 'Startup Ipsilon Spring', date: '4 Jun' },
    ]
  },
  'To Do': {
    id: 'To Do',
    title: 'To Do',
    tasks: [
      { id: '2', title: 'Board Invite', date: '3 Jun' },
      { id: '3', title: 'Create Pitch Deck', date: '3 Jun' },
      { id: '4', title: 'Ask Client X', date: '3 Jun' },
      { id: '5', title: 'Link', date: '3 Jun' },
    ]
  },
  'Done': {
    id: 'Done',
    title: 'Done',
    tasks: [
      { id: '6', title: 'Develop a Tic toc tac app' },
      { id: '7', title: 'Stay healthy' },
      { id: '8', title: 'Finish Design course' },
    ]
  },
  'Ideas': {
    id: 'Ideas',
    title: 'Ideas',
    tasks: [
      { id: '9', title: 'New e-commerce for desi', date: '27 Jun' },
    ]
  }
};

function Board() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [columns, setColumns] = useState(initialColumns);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newListTitle, setNewListTitle] = useState('');
  const [editingListId, setEditingListId] = useState(null);

  useEffect(() => {
    console.log(`Loading board with ID: ${id}`);
    axios.get(`http://localhost:3001/api/boards/${id}`)
      .then(response => {
        setColumns(response.data.columns);
      })
      .catch(error => {
        console.error('Error loading board data:', error);
      });
  }, [id]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination, type } = result;

    if (type === 'COLUMN') {
      const newOrder = Array.from(Object.keys(columns));
      const [removed] = newOrder.splice(source.index, 1);
      newOrder.splice(destination.index, 0, removed);
      const newColumns = {};
      newOrder.forEach(key => {
        newColumns[key] = columns[key];
      });
      setColumns(newColumns);
    } else {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceTasks = [...sourceColumn.tasks];
      const destTasks = [...destColumn.tasks];
      const [removed] = sourceTasks.splice(source.index, 1);
      destTasks.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          tasks: sourceTasks
        },
        [destination.droppableId]: {
          ...destColumn,
          tasks: destTasks
        }
      });
    }
  };

  const addNewTask = (columnId) => {
    const newTaskId = Math.max(...Object.values(columns).flatMap(column => column.tasks.map(task => parseInt(task.id)))) + 1;
    const newTask = {
      id: newTaskId.toString(),
      title: 'New Task',
      date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
    };
    
    setColumns(prevColumns => ({
      ...prevColumns,
      [columnId]: {
        ...prevColumns[columnId],
        tasks: [...prevColumns[columnId].tasks, newTask]
      }
    }));
  };

  const openTaskDetail = (task) => {
    setSelectedTask(task);
  };

  const closeTaskDetail = () => {
    setSelectedTask(null);
  };

  const updateTask = (updatedTask) => {
    setColumns(prevColumns => {
      const newColumns = { ...prevColumns };
      for (let columnId in newColumns) {
        newColumns[columnId].tasks = newColumns[columnId].tasks.map(task =>
          task.id === updatedTask.id ? updatedTask : task
        );
      }
      return newColumns;
    });
  };

  const deleteTask = (taskId) => {
    setColumns(prevColumns => {
      const newColumns = { ...prevColumns };
      for (let columnId in newColumns) {
        newColumns[columnId].tasks = newColumns[columnId].tasks.filter(task => task.id !== taskId);
      }
      return newColumns;
    });
    closeTaskDetail();
  };

  const handleBoardInvite = () => {
    navigate('/members/permission');
  };

  const handleMain = () => {
    navigate('/main');
  };

  const addNewList = () => {
    if (newListTitle.trim() === '') return;
    const newListId = newListTitle.replace(/\s+/g, '-').toLowerCase();
    setColumns(prevColumns => ({
      ...prevColumns,
      [newListId]: {
        id: newListId,
        title: newListTitle,
        tasks: []
      }
    }));
    setNewListTitle('');
  };

  const deleteList = (listId) => {
    setColumns(prevColumns => {
      const newColumns = { ...prevColumns };
      delete newColumns[listId];
      return newColumns;
    });
  };

  const startEditingList = (listId) => {
    setEditingListId(listId);
  };

  const finishEditingList = (listId) => {
    setEditingListId(null);
  };

  const updateListTitle = (listId, newTitle) => {
    setColumns(prevColumns => ({
      ...prevColumns,
      [listId]: {
        ...prevColumns[listId],
        title: newTitle
      }
    }));
  };

  return (
    <div className="trello-board">
      <header className="navbar">
        <div className="title" onClick={handleMain}>Trello - Board {id}</div>
        <div className="buttons">
          <button onClick={handleBoardInvite}>Board Invite</button>
          <button>Board Update</button>
          <button>Board Delete</button>
          <button>Board Create</button>
        </div>
      </header>

      <main className="board-container">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="all-columns" direction="horizontal" type="COLUMN">
            {(provided) => (
              <div
                className="column-container"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {Object.keys(columns).map((columnId, index) => (
                  <Draggable draggableId={columnId} index={index} key={columnId}>
                    {(provided) => (
                      <div
                        className="column"
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                      >
                        <h3 {...provided.dragHandleProps}>
                          {columns[columnId].title}
                          <div className="icon-buttons">
                            <button className="icon-button" onClick={() => startEditingList(columnId)}>
                              <Edit2 size={16} />
                            </button>
                            <button className="icon-button" onClick={() => deleteList(columnId)}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </h3>
                        <Droppable droppableId={columnId} type="TASK">
                          {(provided, snapshot) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              className={`task-list ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                            >
                              {columns[columnId].tasks.map((task, index) => (
                                <Draggable key={task.id} draggableId={task.id} index={index}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`task ${snapshot.isDragging ? 'dragging' : ''}`}
                                      onClick={() => openTaskDetail(task)}
                                    >
                                      <h4>{task.title}</h4>
                                      {task.date && <p>{task.date}</p>}
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                        <button className="add-task-btn" onClick={() => addNewTask(columnId)}>
                          <PlusCircle size={16} />
                          Add a card
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <div className="add-list">
          <input
            type="text"
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
            placeholder="Enter list title..."
          />
          <button onClick={addNewList}>Add List</button>
        </div>
      </main>

      <footer className="footer">
        <p>Current Date: {new Date().toLocaleDateString('ko-KR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </footer>

      {selectedTask && (
        <CardDetailModal
          isOpen={!!selectedTask}
          onClose={closeTaskDetail}
          task={selectedTask}
          onUpdate={updateTask}
          onDelete={deleteTask}
        />
      )}
    </div>
  );
}

export default Board;
