import { api, APIError } from "encore.dev/api";
import { todoDB } from "./db";
import type { UpdateTodoRequest, Todo } from "./types";

// Updates an existing todo item.
export const update = api<UpdateTodoRequest, Todo>(
  { expose: true, method: "PUT", path: "/todos/:id" },
  async (req) => {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (req.title !== undefined) {
      updates.push(`title = $${paramIndex++}`);
      values.push(req.title);
    }

    if (req.description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(req.description || null);
    }

    if (req.completed !== undefined) {
      updates.push(`completed = $${paramIndex++}`);
      values.push(req.completed);
    }

    if (updates.length === 0) {
      throw APIError.invalidArgument("No fields to update");
    }

    updates.push(`updated_at = NOW()`);
    values.push(req.id);

    const query = `
      UPDATE todos 
      SET ${updates.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING id, title, description, completed, created_at, updated_at
    `;

    const row = await todoDB.rawQueryRow<{
      id: number;
      title: string;
      description: string | null;
      completed: boolean;
      created_at: Date;
      updated_at: Date;
    }>(query, ...values);

    if (!row) {
      throw APIError.notFound("Todo not found");
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
