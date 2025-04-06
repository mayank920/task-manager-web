"use client";
import { useState } from "react";
import TaskItem from "@/app/taskItem"; // Import TaskItem

const Home = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: "First Task", completed: false, priority: "Medium", dueDate: ""},
    { id: 2, title: "Second Task", completed: false, priority: "High", dueDate: ""},
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("All");

  const addTask = () => {
    const newTask = { 
      id: Date.now(),
      title: `New Task ${tasks.length + 1}`,
      completed: false,
      priority: "High",
      dueDate: ""
    };
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const editTask = (id: number, newTitle: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, title: newTitle } : task)));
  };

  const toggleComplete = (id: number)=> {
    setTasks(tasks.map((task)=>(task.id===id?{...task, completed: !task.completed} : task)));
  };

  const changeTaskPriority =(id: number, newPriority: string) => {
    setTasks(tasks.map(task=> task.id===id?{...task, priority: newPriority}: task));
  };
  
  const changeDueDate= (id:number, newDate:string)=> {
    setTasks(tasks.map(task=>task.id===id?{...task, dueDate: newDate}: task));
  };

  //sort task
  const priorityOrder: Record<string, number> = { High: 1, Medium: 2, Low: 3};
  const sortedTasks = [...tasks].sort((a, b)=>priorityOrder[a.priority]-priorityOrder[b.priority]);

  const filteredTasks = tasks.filter(
    task=> (filterPriority==="All" || task.priority===filterPriority) && 
            task.title.toLocaleLowerCase().includes(searchTerm.toLowerCase())
  );

  return (

    
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Task Manager</h1>
      <input type="text"
             placeholder="Search Tasks..."
             value={searchTerm}
             onChange={(e)=>setSearchTerm(e.target.value)}
             className="w-full p-2 border border-gray-300 rounded mb-4"/>
      <select value={filterPriority}
              onChange={(e)=> setFilterPriority(e.target.value)}
              className="flex-justify-between mb-4"
              >
                  <option className="bg-blue-500 text-white px-4 py-2 rounded" value="All">All priorites</option>
                  <option className="bg-red-500 text-white px-4 py-2 rounded" value="High">High</option>
                  <option className="bg-yellow-500 text-white px-4 py-2 rounded" value="Medium">Medium</option>
                  <option className="bg-green-500 text-white px-4 py-2 rounded" value="Low">Low</option>
              </select>
      <button onClick={addTask} className=" w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition mb-6">
        Add Task
      </button>

      <div className="mt-4 space-y-2">

        {filteredTasks.map((task) => (
          <TaskItem
          key={task.id}
          task={task}
          onDelete={deleteTask}
          onEdit={editTask}
          onToggleComplete={toggleComplete}
          changeTaskPriority={changeTaskPriority}
          changeDueDate={changeDueDate}/>
        ))}
      </div>
    </div>
    </div>
  );
};

export default Home;