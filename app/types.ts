export type Priority ="High" | "Medium" | "Low";

export type Task = {
    id: string;
    title: string;
    completed: boolean;
    priority: Priority;
    dueDate: string;
  };
  