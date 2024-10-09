"use client";

import React, { useEffect } from "react";
import { List, message } from "antd";

import AuthApi from "../api/auth";
import TodoApi from "../api/todo";

interface TodoItem {
  id: number;
  task_name: string;
  status: boolean;
}

export function TodoState() {
  const [todos, setTodos] = React.useState<TodoItem[]>([]);
  const [task, setTask] = React.useState("");

  const getTodo = async () => {
    try {
      const res = await TodoApi.getAll();
      const updateTodos: TodoItem[] = res.map(todo => {
        delete todo.created_at;
        delete todo.updated_at;
        delete todo.user_id;
        return todo;
      })
      
      if (updateTodos != todos) {
        setTodos(updateTodos);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getTodo();
  }, []);

  const addTodo = async () => {
    if (task.trim() === "") {
      message.error("Task cannot be empty.");
      return;
    }
    try {
      const res = await TodoApi.addItem(task);
    } catch (e) {
      console.log(e);
    }
    setTask("");
    getTodo();
  };

  const toggleTodo = async (id: string) => {
    try {
      const res = await TodoApi.checkItem(id);
      console.log(res);
      getTodo();
    } catch (e) {
      console.log(e);
    }
    message.info("Task status updated.");
  };

  const removeTodo = async (id: string) => {
    try {
      const res = await TodoApi.removeItem(id);
      console.log(res);
      getTodo();
    } catch (e) {
      console.log(e);
    }
    message.success("Task removed.");
  };

  const handleCheckButton = async () => {
    try {
      const res = await AuthApi.secret();
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
      <button onClick={handleCheckButton}>Check</button>
      <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
        <h3 className="text-xl font-semibold">My To-Do List</h3>
        <p className="text-sm text-gray-500">Manage your tasks efficiently</p>
      </div>
      <div className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 sm:px-16">
        {/* Task Input Section */}
        <div className="flex space-x-2">
          <input
            placeholder="Add a new task..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:border-black focus:outline-none focus:ring-black sm:text-sm"
          />
          <button onClick={addTodo}>Add Task</button>
        </div>

        {/* Todo List Section */}
        <List
          itemLayout="horizontal"
          dataSource={todos}
          renderItem={(todo) => (
            <List.Item
              actions={[
                <button
                  key={todo.id}
                  onClick={() => toggleTodo(todo.id)}
                  className={todo.status ? "text-green-500" : ""}
                >
                  {todo.status ? "Undo" : "Complete"}
                </button>,
                <button onClick={() => removeTodo(todo.id)} key={todo.id}>
                  Remove
                </button>,
              ]}
            >
              <div
                className={todo.status ? "line-through text-gray-500" : ""}
              >
                {todo.task_name}
              </div>
            </List.Item>
          )}
          locale={{ emptyText: "No tasks added yet." }}
        />
      </div>
    </div>
  );
}
