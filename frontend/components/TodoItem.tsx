import { useState } from "react";
import { Check, Edit2, Trash2, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import type { Todo, UpdateTodoRequest } from "~backend/todo/types";

interface TodoItemProps {
  todo: Todo;
  onUpdate: (todo: UpdateTodoRequest) => void;
  onDelete: (id: number) => void;
  onToggleComplete: (todo: Todo) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export default function TodoItem({
  todo,
  onUpdate,
  onDelete,
  onToggleComplete,
  isUpdating,
  isDeleting,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || "");

  const handleSave = () => {
    if (!editTitle.trim()) return;

    onUpdate({
      id: todo.id,
      title: editTitle.trim(),
      description: editDescription.trim() || undefined,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || "");
    setIsEditing(false);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className={`transition-all duration-200 ${todo.completed ? "opacity-75" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <Checkbox
              checked={todo.completed}
              onCheckedChange={() => onToggleComplete(todo)}
              disabled={isUpdating || isDeleting}
            />
          </div>

          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-3">
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Todo title"
                  className="font-medium"
                />
                <Textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Description (optional)"
                  rows={2}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={!editTitle.trim() || isUpdating}
                  >
                    <Save className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isUpdating}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <h3
                  className={`font-medium text-gray-900 ${
                    todo.completed ? "line-through text-gray-500" : ""
                  }`}
                >
                  {todo.title}
                </h3>
                {todo.description && (
                  <p
                    className={`text-sm text-gray-600 mt-1 ${
                      todo.completed ? "line-through text-gray-400" : ""
                    }`}
                  >
                    {todo.description}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  Created {formatDate(todo.createdAt)}
                  {todo.updatedAt !== todo.createdAt && (
                    <span> • Updated {formatDate(todo.updatedAt)}</span>
                  )}
                </p>
              </div>
            )}
          </div>

          {!isEditing && (
            <div className="flex gap-1 flex-shrink-0">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                disabled={isUpdating || isDeleting}
              >
                <Edit2 className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(todo.id)}
                disabled={isUpdating || isDeleting}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
