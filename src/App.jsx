import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { FaEdit } from 'react-icons/fa';
import { AiFillDelete } from 'react-icons/ai';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [priorityLevel, setPriorityLevel] = useState('low');
  const [todos, setTodos] = useState([]);
  const [showFinished, setShowFinished] = useState(true);
  const [editingTodoId, setEditingTodoId] = useState(null); 
  const [editedTodoText, setEditedTodoText] = useState({}); 

  useEffect(() => {
    const todoString = localStorage.getItem('todos');
    if (todoString) {
      setTodos(JSON.parse(todoString));
    }
  }, []);

  const saveToLS = (updatedTodos) => {
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
    setTodos(updatedTodos);
  };

  const toggleFinished = () => {
    setShowFinished(!showFinished);
  };

  const handleEdit = (id, todoText) => {
    setEditingTodoId(id); 
    setEditedTodoText({ [id]: todoText }); 
  };

  const handleSaveEdit = (id) => {
    const updatedTodos = todos.map((item) =>
      item.id === id ? { ...item, taskName: editedTodoText[id] } : item
    );
    saveToLS(updatedTodos);
    setEditingTodoId(null); 
  };

  const handleDelete = (id) => {
    const updatedTodos = todos.filter((item) => item.id !== id);
    saveToLS(updatedTodos);
  };

  const handleAdd = () => {
    if (taskName.trim() === '') return;
    const updatedTodos = [...todos, { id: uuidv4(), taskName, taskDescription, priorityLevel, isCompleted: false }];
    saveToLS(updatedTodos);
    setTaskName('');
    setTaskDescription('');
    setPriorityLevel('low');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'taskName') {
      setTaskName(value);
    } else if (name === 'taskDescription') {
      setTaskDescription(value);
    } else if (name === 'priorityLevel') {
      setPriorityLevel(value);
    }
  };

  const handleCheckbox = (id) => {
    const updatedTodos = todos.map((item) =>
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    );
    saveToLS(updatedTodos);
  };

  return (
    <>
      <Navbar />
      <div className="mx-3 md:container md:mx-auto my-5 rounded-xl p-5 bg-violet-100 min-h-[80vh] md:w-[35%]">
        <h1 className="font-bold text-center text-3xl">Task Manager</h1>
        <div className="addTodo my-5 flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Add a Todo</h2>
          <div className="flex flex-col gap-2">
            <input
              name="taskName"
              onChange={handleChange}
              value={taskName}
              type="text"
              placeholder="Task Name"
              className="rounded-full px-5 py-1"
            />
            <textarea
              name="taskDescription"
              onChange={handleChange}
              value={taskDescription}
              placeholder="Task Description"
              className="rounded-lg px-5 py-3"
            />
            <select
              name="priorityLevel"
              onChange={handleChange}
              value={priorityLevel}
              className="rounded-full px-5 py-1"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <button
              onClick={handleAdd}
              disabled={taskName.length <= 3}
              className="bg-violet-800 rounded-full hover:bg-violet-950 disabled:bg-violet-500 p-4 py-2 text-sm font-bold text-white"
            >
              Save
            </button>
          </div>
        </div>
        <input
          className="my-4"
          id="show"
          onChange={toggleFinished}
          type="checkbox"
          checked={showFinished}
        />
        <label className="mx-2" htmlFor="show">
          Show Finished
        </label>
        <div className="h-[1px] bg-black opacity-15 w-[90%] mx-auto my-2"></div>
        <h2 className="text-2xl font-bold">Your Todos</h2>
        <div className="todos">
          {todos.length === 0 && (
            <div className="m-5">No Todos to display</div>
          )}
          {todos.map((item) =>
            (showFinished || !item.isCompleted) && (
              <div key={item.id} className="todo flex my-3 justify-between">
                <div className="flex gap-5">
                  <input
                    name={item.id}
                    onChange={() => handleCheckbox(item.id)}
                    type="checkbox"
                    checked={item.isCompleted}
                  />
                  {editingTodoId === item.id ? (
                    <input
                      type="text"
                      value={editedTodoText[item.id] || item.taskName} 
                      onChange={(e) =>
                        setEditedTodoText({
                          ...editedTodoText,
                          [item.id]: e.target.value,
                        })
                      }
                      autoFocus
                    />
                  ) : (
                    <div className={item.isCompleted ? 'line-through' : ''}>
                      <div><strong>{item.taskName}</strong></div>
                      <div>{item.taskDescription}</div>
                      <div>Priority: {item.priorityLevel}</div>
                    </div>
                  )}
                </div>
                <div className="buttons flex h-full">
                  {editingTodoId !== item.id ? (
                    <button
                      onClick={() => handleEdit(item.id, item.taskName)} 
                      className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1"
                    >
                      <FaEdit />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSaveEdit(item.id)} 
                      className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1"
                    >
                      Save
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1"
                  >
                    <AiFillDelete />
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}

export default App;
