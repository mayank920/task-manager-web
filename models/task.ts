// models/Task.ts
import mongoose, { Schema, Document } from "mongoose";

export type Priority = "High" | "Medium" | "Low";

export interface ITask extends Document {
  title: string;
  completed: boolean;
  priority: Priority;
  dueDate: string;
}

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    priority: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
    dueDate: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);