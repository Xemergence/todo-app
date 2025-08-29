import { Loader2 } from "lucide-react";
import type { Todo, UpdateTodoRequest } from "~backend/todo/types";
import TodoItem from "./TodoItem";

interface TodoListProps {
  todos: Todo[];
  isLoading: boolean;
  onUpdateTodo: (todo: UpdateTodoRequest) => void;
  onDeleteTodo: (id: number) => void;
  onToggleComplete: (todo: Todo) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export default function TodoList({
  todos,
  isLoading,
  onUpdateTodo,
  onDeleteTodo,
  onToggleComplete,
  isUpdating,
  isDeleting,
}: TodoListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading todos...</span>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No todos yet. Add your first todo to get started!
      </div>
    );
  }

  const completedTodos = todos.filter(todo => todo.completed);
  const incompleteTodos = todos.filter(todo => !todo.completed);

  return (
    <div className="space-y-6">
      {incompleteTodos.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Active Tasks ({incompleteTodos.length})
          </h2>
          <div className="space-y-2">
            {incompleteTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onUpdate={onUpdateTodo}
                onDelete={onDeleteTodo}
                onToggleComplete={onToggleComplete}
                isUpdating={isUpdating}
                isDeleting={isDeleting}
              />
            ))}
          </div>
        </div>
      )}

      {completedTodos.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Completed Tasks ({completedTodos.length})
          </h2>
          <div className="space-y-2">
            {completedTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onUpdate={onUpdateTodo}
                onDelete={onDeleteTodo}
                onToggleComplete={onToggleComplete}
                isUpdating={isUpdating}
                isDeleting={isDeleting}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
