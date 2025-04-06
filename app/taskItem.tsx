"use client";
import { Priority, Task } from "./types";

interface TaskProps{
  task:Task;

    onDelete: (id: string)=> void;
    onEdit: (id: string, newTitle: string)=> void;
    onToggleComplete: (id: string, currentStatus: boolean) => void;
    changeTaskPriority: (id: string, newPriority: Priority) => void;
    changeDueDate: (id: string, newDate: string)=> void;
}

const TaskItem: React.FC<TaskProps> = ({task, onDelete, onEdit, onToggleComplete, changeTaskPriority, changeDueDate})=>{
    // const [isEditing, setIsEditing] = useState(false);
    // const [newTitle, setNewTitle] = useState(task.title);
    // const [priority, setPriority] = useState(task.priority);

    // const handleEdit=()=>{
    //     if (isEditing) onEdit(task.id, newTitle);
    //     setIsEditing(!isEditing);
    // };



return (
    <div className={`flex justify-between items-center p-3 rounded-lg shadow ${task.completed ? "bg-gray-200 line-through" : "bg-white"}`}>
      <span>[{task.priority}]{task.title}</span>

      <div className="space-x-2">
        <button onClick={() => onToggleComplete(task.id, task.completed)} className={`px-3 py-1 rounded ${task.completed ? "bg-gray-500" : "bg-blue-500"} text-white`}>
          {task.completed ? "Undo" : "Complete"}
        </button>
        <button onClick={() => onEdit(task.id, prompt("Edit Task:", task.title) || task.title)} className="px-3 py-1 bg-yellow-500 text-white rounded">
          Edit
        </button>
                
        <select 
                value={task.priority}
                onChange={(e)=> changeTaskPriority(task.id, e.target.value as Priority)}
                >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
        </select>        
        <input type="date"
               value={task.dueDate}
               onChange={(e)=> changeDueDate(task.id, e.target.value)}
               className="border px-2 py-1 rounded" />
        <button onClick={() => onDelete(task.id)} className="px-3 py-1 bg-red-500 text-white rounded">
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;