// app/api/tasks/[id]/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Task from "@/models/task";

interface Params {
  params: { id: string };
}

export async function PATCH(request: Request, { params }: {params: {id: string}}) {
  await connectDB();
  const {completed} = await request.json();
  try {
    const updatedTask = await Task.findByIdAndUpdate(params.id, {completed}, { new: true });
    if (!updatedTask) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }
    return NextResponse.json({
      id: updatedTask._id.toString(),
      title: updatedTask.title,
      priority: updatedTask.priority,
      dueDate: updatedTask.dueDate,
      completed: updatedTask.completed,
    });
  } catch (error) {
    return NextResponse.json({ message: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  await connectDB();

  try {
    const deletedTask = await Task.findByIdAndDelete(params.id);
    if (!deletedTask) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Task deleted" });
  } catch (_error) {
    return NextResponse.json({ message: "Failed to delete task" }, { status: 500 });
  }
}
