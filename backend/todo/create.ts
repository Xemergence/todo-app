import { api } from "encore.dev/api";
import { todoDB } from "./db";
import type { CreateTodoRequest, Todo } from "./types";

// Creates a new todo item.
export const create = api<CreateTodoRequest, Todo>(
  { expose: true, method: "POST", path: "/todos" },
  async (req) => {
    const row = await todoDB.queryRow<{
      id: number;
      title: string;
      description: string | null;
      completed: boolean;
      created_at: Date;
      updated_at: Date;
    }>`
      INSERT INTO todos (title, description)
      VALUES (${req.title}, ${req.description || null})
      RETURNING id, title, description, completed, created_at, updated_at
    `;

    if (!row) {
      throw new Error("Failed to create todo");
    }

    return {
      id: row.id,
      title: row.title,
      description: row.description || undefined,
      completed: row.completed,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
);
