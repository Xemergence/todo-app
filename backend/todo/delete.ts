import { api, APIError } from "encore.dev/api";
import { todoDB } from "./db";

interface DeleteTodoRequest {
  id: number;
}

// Deletes a todo item.
export const deleteTodo = api<DeleteTodoRequest, void>(
  { expose: true, method: "DELETE", path: "/todos/:id" },
  async (req) => {
    const result = await todoDB.exec`
      DELETE FROM todos WHERE id = ${req.id}
    `;

    // Note: PostgreSQL doesn't return affected rows count in this context,
    // but the operation will succeed even if the todo doesn't exist
  }
);
