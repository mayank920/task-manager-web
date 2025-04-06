"use client";
import { useEffect, useState } from "react";
import TaskItem from "@/app/taskItem"; // Import TaskItem
import { Priority, Task } from "../types";

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isValidPriority = (priority: string): priority is Priority => {return ["High", "Medium", "Low"].includes(priority);};

  useEffect(()=>{
    const fetchTasks = async()=>{
      try{
        const response = await fetch("/api/tasks");
        const text = await response.text(); // Read response as text first

        console.log("Raw API response:", text);// Log raw response

      if (!response.ok) {
        console.error("API error:", response.status, response.statusText);
        return;
      }

      const data = JSON.parse(text); 
      console.log("Parsed JSON data:", data);
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const validatedTasks: Task[] = data.map((task: any)=>({...task,
        id: task._id || task.id || crypto.randomUUID(),
        completed: task.completed,
        priority: isValidPriority(task.priority)? task.priority: "High",}))
      console.log("parsed tasks:", data)// Parse JSON safely
      setTasks(validatedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }

  };

    fetchTasks();
  }, []);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("All");

  const addTask = async () => {
    if (!newTaskTitle.trim()) return;
    if (tasks.some(task => task.title.toLowerCase() === newTaskTitle.toLowerCase())) {
      alert("Task with this title already exists");
      return;
    }
  
    let aiPriority: Priority = "Medium"; // Fallback default
  
    try {
      const priorityResponse = await fetch("/api/tasks/priority", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTaskTitle }),
      });
  
      if (priorityResponse.ok) {
        const data = await priorityResponse.json();
        if (["High", "Medium", "Low"].includes(data.priority)) {
          aiPriority = data.priority as Priority;
        } else {
          console.warn("Invalid priority from AI:", data.priority);
        }
      } else {
        console.warn("Priority API error:", priorityResponse.statusText);
      }
    } catch (err) {
      console.error("Error fetching AI priority:", err);
    }
  
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: newTaskTitle,
      completed: false,
      priority: aiPriority,
      dueDate: "",
    };
  
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });
  
      if (!response.ok) {
        console.error("Failed to add task:", response.statusText);
        return;
      }
  
      const savedTaskRaw = await response.json();
      const savedTask: Task = {
        ...savedTaskRaw,
        id: savedTaskRaw._id,
      };
  
      setTasks(prevTasks => [...prevTasks, savedTask]);
      setNewTaskTitle("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };
  
    

 // 🔁 Toggle complete
 const toggleComplete = async (id: string, currentStatus: boolean) => {
  try {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !currentStatus }),
    });

    if (!res.ok) throw new Error("Failed to toggle task");

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  } catch (err) {
    console.error("Toggle error:", err);
  }
};


// 🗑️ Delete task
const deleteTask = async (id: string) => {
  try {
    const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Delete failed");
    setTasks((prev) => prev.filter((task) => task.id !== id));
  } catch (err) {
    console.error("Delete error:", err);
  }
};

// ✏️ Edit task title
const editTask = async (id: string, newTitle: string) => {
  try {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    });
    if (!res.ok) throw new Error("Edit failed");

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, title: newTitle } : task
      )
    );
  } catch (err) {
    console.error("Edit error:", err);
  }
};

// 🔼 Change priority
const changeTaskPriority = async (id: string, newPriority: Priority) => {
  try {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priority: newPriority }),
    });
    if (!res.ok) throw new Error("Priority update failed");

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, priority: newPriority } : task
      )
    );
  } catch (err) {
    console.error("Priority error:", err);
  }
};

// 📅 Change due date
const changeDueDate = async (id: string, newDate: string) => {
  try {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dueDate: newDate }),
    });
    if (!res.ok) throw new Error("Due date update failed");

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, dueDate: newDate } : task
      )
    );
  } catch (err) {
    console.error("Due date error:", err);
  }
};
  //sort task
  const priorityOrder: Record<string, number> = { High: 1, Medium: 2, Low: 3};
  const sortedTasks = [...tasks].sort((a, b)=>priorityOrder[a.priority]-priorityOrder[b.priority]);

  const filteredTasks = sortedTasks.filter(
    task=> (filterPriority==="All" || task.priority===filterPriority) && 
            task.title.toLowerCase().includes(searchTerm.toLowerCase())
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
              className="w-full p-2 border border-gray-300 rounded mb-4 bg-white"
              >
                  <option className="bg-blue-500 text-white px-4 py-2 rounded" value="All">All priorites</option>
                  <option className="bg-red-500 text-white px-4 py-2 rounded" value="High">High</option>
                  <option className="bg-yellow-500 text-white px-4 py-2 rounded" value="Medium">Medium</option>
                  <option className="bg-green-500 text-white px-4 py-2 rounded" value="Low">Low</option>
              </select>
              <input
                  type="text"
                  placeholder="Enter task title..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mb-4"
                />
      <button onClick={addTask} className=" w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition mb-6">
        Add Task
      </button>

      <div className="mt-4 space-y-2">

        {filteredTasks.map((task) => (
          task.id ? (
          <TaskItem
          key={task.id}
          task={task as Task}
          onDelete={deleteTask}
          onEdit={editTask}
          onToggleComplete={toggleComplete}
          changeTaskPriority={changeTaskPriority}
          changeDueDate={changeDueDate}/>
        ): null))}
      </div>
    </div>
    </div>
  );
};

export default Dashboard;