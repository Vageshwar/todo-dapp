import { useState, useEffect, useCallback } from 'react'
import { useTodoContract } from '../utils/todoContract'
import TodoInput from './TodoInput'
import TodoItem from './TodoItem'
import { usePublicClient } from 'wagmi'
import { Log } from 'viem'

interface Todo {
  id: number
  text: string
  completed: boolean
}

interface ContractTodo {
  id: bigint
  content: string
  isCompleted: boolean
  createdAt: bigint
  updatedAt: bigint
}

const TodoList = () => {
  const { contract, address } = useTodoContract()
  const publicClient = usePublicClient()
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTodos = useCallback(async () => {
    if (!contract) {
      console.log('No contract available');
      return;
    }
    try {
      setLoading(true)
      setError(null)
      console.log('Fetching todos...');
      const todos = await contract.read.getUserTodos() as ContractTodo[]
      console.log('Todos fetched:', todos);
      
      if (todos.length === 0) {
        console.log('No todos found for this address');
        setTodos([])
        return
      }

      setTodos(todos.map(todo => ({
        id: Number(todo.id),
        text: todo.content,
        completed: todo.isCompleted
      })))
    } catch (error) {
      console.error('Error fetching todos:', error)
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
        setError(error.message)
      }
    } finally {
      setLoading(false)
    }
  }, [contract])

  // Set up event listeners
  useEffect(() => {
    if (!contract || !address) return;

    const unwatch = contract.watchEvent.TodoCreated(
      { owner: address },
      {
        onLogs: (logs: Log[]) => {
          console.log('TodoCreated event:', logs);
          fetchTodos();
        },
        onError: (error: Error) => {
          console.error('Error watching TodoCreated event:', error);
        }
      }
    );

    const unwatch2 = contract.watchEvent.TodoUpdated(
      {},
      {
        onLogs: (logs: Log[]) => {
          console.log('TodoUpdated event:', logs);
          fetchTodos();
        },
        onError: (error: Error) => {
          console.error('Error watching TodoUpdated event:', error);
        }
      }
    );

    const unwatch3 = contract.watchEvent.TodoToggled(
      {},
      {
        onLogs: (logs: Log[]) => {
          console.log('TodoToggled event:', logs);
          fetchTodos();
        },
        onError: (error: Error) => {
          console.error('Error watching TodoToggled event:', error);
        }
      }
    );

    const unwatch4 = contract.watchEvent.TodoDeleted(
      {},
      {
        onLogs: (logs: Log[]) => {
          console.log('TodoDeleted event:', logs);
          fetchTodos();
        },
        onError: (error: Error) => {
          console.error('Error watching TodoDeleted event:', error);
        }
      }
    );

    return () => {
      unwatch();
      unwatch2();
      unwatch3();
      unwatch4();
    };
  }, [contract, address, fetchTodos]);

  useEffect(() => {
    if (address) {
      console.log('Address changed, fetching todos...');
      fetchTodos()
    } else {
      setTodos([])
      setError(null)
    }
  }, [address, fetchTodos])

  const addTodo = async (text: string) => {
    if (!contract || !publicClient) {
      console.log('No contract or public client available');
      return;
    }
    try {
      setLoading(true)
      setError(null)
      console.log('Creating todo...');
      const hash = await contract.write.createTodo([text])
      console.log('Transaction hash:', hash);
      await publicClient.waitForTransactionReceipt({ hash })
      // No need to fetch todos here as the event listener will handle it
    } catch (error) {
      console.error('Error creating todo:', error)
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
        setError(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const toggleTodo = async (id: number) => {
    if (!contract || !publicClient) {
      console.log('No contract or public client available');
      return;
    }
    try {
      setLoading(true)
      setError(null)
      console.log('Toggling todo...');
      const hash = await contract.write.toggleTodo([id])
      console.log('Transaction hash:', hash);
      await publicClient.waitForTransactionReceipt({ hash })
      // No need to fetch todos here as the event listener will handle it
    } catch (error) {
      console.error('Error toggling todo:', error)
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
        setError(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const deleteTodo = async (id: number) => {
    if (!contract || !publicClient) {
      console.log('No contract or public client available');
      return;
    }
    try {
      setLoading(true)
      setError(null)
      console.log('Deleting todo...');
      const hash = await contract.write.deleteTodo([id])
      console.log('Transaction hash:', hash);
      await publicClient.waitForTransactionReceipt({ hash })
      // No need to fetch todos here as the event listener will handle it
    } catch (error) {
      console.error('Error deleting todo:', error)
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
        setError(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const editTodo = async (id: number, newText: string) => {
    if (!contract || !publicClient) {
      console.log('No contract or public client available');
      return;
    }
    try {
      setLoading(true)
      setError(null)
      console.log('Updating todo...');
      const hash = await contract.write.updateTodo([id, newText])
      console.log('Transaction hash:', hash);
      await publicClient.waitForTransactionReceipt({ hash })
      // No need to fetch todos here as the event listener will handle it
    } catch (error) {
      console.error('Error updating todo:', error)
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
        setError(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <TodoInput onAdd={addTodo} disabled={loading} />
      
      {error && (
        <div className="text-red-500 text-center py-2">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : todos.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No todos yet. Add your first todo!
        </div>
      ) : (
        <div className="space-y-3">
          {todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
              disabled={loading}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default TodoList 