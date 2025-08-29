import { api } from "encore.dev/api";
import { todoDB } from "./db";
import type { ListTodosResponse, Todo } from "./types";

// Retrieves all todo items, ordered by creation date (latest first).
export const list = api<void, ListTodosResponse>(
  { expose: true, method: "GET", path: "/todos" },
  async () => {
    const rows = await todoDB.queryAll<{
      id: number;
      title: string;
      description: string | null;
      completed: boolean;
      created_at: Date;
      updated_at: Date;
    }>`
      SELECT id, title, description, completed, created_at, updated_at
      FROM todos
      ORDER BY created_at DESC
    `;

    const todos: Todo[] = rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description || undefined,
      completed: row.completed,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return { todos };
  }
);
