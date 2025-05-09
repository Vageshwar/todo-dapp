import React, { useState } from 'react'

interface Todo {
  id: number
  text: string
  completed: boolean
}

interface TodoItemProps {
  todo: Todo
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  onEdit: (id: number, newText: string) => void
  disabled?: boolean
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onEdit, disabled = false }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)

  const handleEdit = () => {
    if (editText.trim() && !disabled) {
      onEdit(todo.id, editText)
      setIsEditing(false)
    }
  }

  return (
    <div className="group flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => !disabled && onToggle(todo.id)}
        className="h-5 w-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={disabled}
      />
      
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleEdit()}
          className="flex-1 p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
          disabled={disabled}
        />
      ) : (
        <span className={`flex-1 ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
          {todo.text}
        </span>
      )}

      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {isEditing ? (
          <button
            onClick={handleEdit}
            className="text-green-500 hover:text-green-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={disabled}
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => !disabled && setIsEditing(true)}
            className="text-blue-500 hover:text-blue-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={disabled}
          >
            Edit
          </button>
        )}
        <button
          onClick={() => !disabled && onDelete(todo.id)}
          className="text-red-500 hover:text-red-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={disabled}
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default TodoItem 