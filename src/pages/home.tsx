import { useState } from 'react'
import { useAccount } from 'wagmi'
import WalletConnect from '../components/WalletConnect'
import TodoInput from '../components/TodoInput'
import TodoItem from '../components/TodoItem'

interface Todo {
  id: number
  text: string
  completed: boolean
}

const Home = () => {
  const { isConnected } = useAccount()
  const [todos, setTodos] = useState<Todo[]>([])

  const addTodo = (text: string) => {
    setTodos([...todos, { id: Date.now(), text, completed: false }])
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const editTodo = (id: number, newText: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: newText } : todo
    ))
  }

  if (!isConnected) {
    return <WalletConnect />
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto pb-16">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          TodoDApp
        </h1>
        
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <TodoInput onAdd={addTodo} />
          
          <div className="space-y-3">
            {todos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={editTodo}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white bg-opacity-90 backdrop-blur-sm shadow-lg">
        <div className="container mx-auto px-4 py-3 text-center">
          <a 
            href="https://vageshwar.dev" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
          >
            Made by Vageshwar.dev
          </a>
        </div>
      </div>
    </div>
  )
}

export default Home