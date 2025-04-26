# Todo DApp Smart Contract Design

## Overview
The smart contract will manage todo items for each user's wallet address, allowing creation, updating, deletion, and status changes of todos.

## Contract Structure

### State Variables
```solidity
struct Todo {
    uint256 id;
    string text;
    bool completed;
    uint256 createdAt;
    uint256 updatedAt;
}

// Mapping from user address to their todos
mapping(address => Todo[]) private userTodos;

// Mapping to track todo ownership
mapping(address => mapping(uint256 => bool)) private todoOwnership;

// Counter for generating unique todo IDs
uint256 private todoIdCounter;
```

### Main Functions

#### 1. Create Todo
```solidity
function createTodo(string memory _text) public returns (uint256) {
    uint256 todoId = todoIdCounter++;
    Todo memory newTodo = Todo({
        id: todoId,
        text: _text,
        completed: false,
        createdAt: block.timestamp,
        updatedAt: block.timestamp
    });
    
    userTodos[msg.sender].push(newTodo);
    todoOwnership[msg.sender][todoId] = true;
    
    emit TodoCreated(msg.sender, todoId, _text);
    return todoId;
}
```

#### 2. Toggle Todo Status
```solidity
function toggleTodo(uint256 _todoId) public {
    require(todoOwnership[msg.sender][_todoId], "Not todo owner");
    
    Todo[] storage todos = userTodos[msg.sender];
    for (uint i = 0; i < todos.length; i++) {
        if (todos[i].id == _todoId) {
            todos[i].completed = !todos[i].completed;
            todos[i].updatedAt = block.timestamp;
            emit TodoToggled(msg.sender, _todoId, todos[i].completed);
            break;
        }
    }
}
```

#### 3. Update Todo Text
```solidity
function updateTodoText(uint256 _todoId, string memory _newText) public {
    require(todoOwnership[msg.sender][_todoId], "Not todo owner");
    
    Todo[] storage todos = userTodos[msg.sender];
    for (uint i = 0; i < todos.length; i++) {
        if (todos[i].id == _todoId) {
            todos[i].text = _newText;
            todos[i].updatedAt = block.timestamp;
            emit TodoUpdated(msg.sender, _todoId, _newText);
            break;
        }
    }
}
```

#### 4. Delete Todo
```solidity
function deleteTodo(uint256 _todoId) public {
    require(todoOwnership[msg.sender][_todoId], "Not todo owner");
    
    Todo[] storage todos = userTodos[msg.sender];
    for (uint i = 0; i < todos.length; i++) {
        if (todos[i].id == _todoId) {
            // Move the last element to the position of the element to delete
            todos[i] = todos[todos.length - 1];
            todos.pop();
            delete todoOwnership[msg.sender][_todoId];
            emit TodoDeleted(msg.sender, _todoId);
            break;
        }
    }
}
```

#### 5. Get User Todos
```solidity
function getUserTodos() public view returns (Todo[] memory) {
    return userTodos[msg.sender];
}
```

### Events
```solidity
event TodoCreated(address indexed user, uint256 indexed todoId, string text);
event TodoToggled(address indexed user, uint256 indexed todoId, bool completed);
event TodoUpdated(address indexed user, uint256 indexed todoId, string newText);
event TodoDeleted(address indexed user, uint256 indexed todoId);
```

## Implementation Plan

1. **Setup Development Environment**
   - Use Hardhat for development and testing
   - Setup local development network
   - Configure deployment scripts for Sepolia testnet

2. **Contract Development**
   - Implement base contract structure
   - Add CRUD operations for todos
   - Implement view functions
   - Add events for frontend tracking

3. **Testing**
   - Write unit tests for all functions
   - Test edge cases and error conditions
   - Test gas optimization

4. **Security Considerations**
   - Implement access control
   - Add input validation
   - Gas optimization
   - Consider reentrancy protection

5. **Frontend Integration**
   - Create contract interface (ABI)
   - Implement web3 interaction functions
   - Add loading states for transactions
   - Handle transaction errors

6. **Deployment**
   - Deploy to Sepolia testnet
   - Verify contract on Etherscan
   - Update frontend with contract address

## Gas Optimization Strategies
1. Use packed structs
2. Batch operations where possible
3. Optimize storage vs memory usage
4. Use events for historical data

## Security Considerations
1. Access control for todo operations
2. Input validation for text length
3. Protection against integer overflow
4. Gas limits for arrays
5. Proper event emission

## Next Steps
1. Create Hardhat project
2. Implement base contract
3. Write test cases
4. Deploy to testnet
5. Integrate with frontend 