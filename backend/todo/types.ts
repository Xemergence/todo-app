export interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
}

export interface UpdateTodoRequest {
  id: number;
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface ListTodosResponse {
  todos: Todo[];
}
