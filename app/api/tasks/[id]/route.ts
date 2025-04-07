// app/api/tasks/[id]/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Task from "@/models/task";
// import mongoose from "mongoose";

// interface Params {
//   params: { id: string };
// }

export async function PATCH(request: Request, context: {params: {id: string}}) {
  await connectDB();
  const {completed} = await request.json();
  const {id} = context.params;
  try {
    const updatedTask = await Task.findByIdAndUpdate(id, {completed}, { new: true });
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
    console.log(error)
    return NextResponse.json({ message: "Failed to update task" }, { status: 500 });
  }
}
// app/api/tasks/[id]/route.ts

// app/api/tasks/[id]/route.ts
// '@ts-expect-error'
type Params = {
  params: {
    id: string;
  };
};
export async function DELETE(
  _req: Request, 
  {params}: Params
) {
  
  try {
    await connectDB();

    await Task.findByIdAndDelete(params.id);

    return new Response("Deleted", { status: 200 });
  } catch (error) {
    console.error(error)
    return new Response("Failed to delete task", { status: 500 });
  }
}
// import { ObjectId } from "mongodb";
// export async function DELETE( request: Request, context:{ params:{ id: string}}
// ) {

//   await connectDB();
//   const { id } = context.params;

//   try {
//     const deletedTask = await Task.findByIdAndDelete(id);

//     if (!deletedTask) {
//       return NextResponse.json({ message: "Task not found" }, { status: 404 });
//     }

//     return NextResponse.json({ message: "Task deleted" }, { status: 200 });
//   } catch (error) {
//     console.error("DELETE error:", error);
//     return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//   }
// }
// export async function DELETE(_req: Request, { params }: Params) {
//   await connectDB();

//   try {
//     const deletedTask = await Task.findByIdAndDelete(params.id);
//     if (!deletedTask) {
//       return NextResponse.json({ message: "Task not found" }, { status: 404 });
//     }
//     return NextResponse.json({ message: "Task deleted" });
//   } catch (error) {
//     console.log(error)
//     return NextResponse.json({ message: "Failed to delete task" }, { status: 500 });
//   }
// }
