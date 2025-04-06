// app/api/tasks/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Task from "@/models/task";

export async function GET() {
  try {
    await connectDB();
    const tasks = await Task.find();

    const transformed = tasks.map((task) => ({
      id: task._id.toString(),
      title: task.title,
      priority: task.priority,
      dueDate: task.dueDate,
      completed: task.completed,
    }))
    return NextResponse.json(transformed);
  } catch (error) {
    console.error("GET /api/tasks ERROR:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { title, priority, dueDate } = body;

    const newTask = await Task.create({ title, priority, dueDate, completed: false });
    return NextResponse.json({
      id: newTask._id.toString(),
      title: newTask.title,
      priority: newTask.priority,
      dueDate: newTask.dueDate,
      completed: newTask.completed,
    });
  } catch (error) {
    console.error("POST /api/tasks ERROR:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}