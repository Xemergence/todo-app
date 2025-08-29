import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import backend from "~backend/client";
import type { Todo, CreateTodoRequest, UpdateTodoRequest } from "~backend/todo/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import TodoList from "./TodoList";
import AddTodoForm from "./AddTodoForm";

export default function TodoApp() {
  const [showAddForm, setShowAddForm] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: todosData, isLoading, error } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      try {
        return await backend.todo.list();
      } catch (err) {
        console.error("Failed to fetch todos:", err);
        throw err;
      }
    },
  });

  const createTodoMutation = useMutation({
    mutationFn: async (todo: CreateTodoRequest) => {
      try {
        return await backend.todo.create(todo);
      } catch (err) {
        console.error("Failed to create todo:", err);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setShowAddForm(false);
      toast({
        title: "Success",
        description: "Todo created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create todo",
        variant: "destructive",
      });
    },
  });

  const updateTodoMutation = useMutation({
    mutationFn: async (todo: UpdateTodoRequest) => {
      try {
        return await backend.todo.update(todo);
      } catch (err) {
        console.error("Failed to update todo:", err);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast({
        title: "Success",
        description: "Todo updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update todo",
        variant: "destructive",
      });
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: async (id: number) => {
      try {
        return await backend.todo.deleteTodo({ id });
      } catch (err) {
        console.error("Failed to delete todo:", err);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast({
        title: "Success",
        description: "Todo deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete todo",
        variant: "destructive",
      });
    },
  });

  const handleCreateTodo = (todo: CreateTodoRequest) => {
    createTodoMutation.mutate(todo);
  };

  const handleUpdateTodo = (todo: UpdateTodoRequest) => {
    updateTodoMutation.mutate(todo);
  };

  const handleDeleteTodo = (id: number) => {
    deleteTodoMutation.mutate(id);
  };

  const handleToggleComplete = (todo: Todo) => {
    handleUpdateTodo({
      id: todo.id,
      completed: !todo.completed,
    });
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          Failed to load todos. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Todo App</h1>
        <p className="text-gray-600">Manage your tasks efficiently</p>
      </div>

      <div className="mb-6">
        {!showAddForm ? (
          <Button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Todo
          </Button>
        ) : (
          <AddTodoForm
            onSubmit={handleCreateTodo}
            onCancel={() => setShowAddForm(false)}
            isLoading={createTodoMutation.isPending}
          />
        )}
      </div>

      <TodoList
        todos={todosData?.todos || []}
        isLoading={isLoading}
        onUpdateTodo={handleUpdateTodo}
        onDeleteTodo={handleDeleteTodo}
        onToggleComplete={handleToggleComplete}
        isUpdating={updateTodoMutation.isPending}
        isDeleting={deleteTodoMutation.isPending}
      />
    </div>
  );
}
