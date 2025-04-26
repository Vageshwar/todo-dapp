// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract TodoList is Ownable {
    uint256 private _todoIds;

    struct Todo {
        uint256 id;
        string content;
        bool isCompleted;
        uint256 createdAt;
        uint256 updatedAt;
    }

    // Mapping from todo ID to Todo struct
    mapping(uint256 => Todo) private _todos;
    
    // Mapping from owner to their todo IDs
    mapping(address => uint256[]) private _userTodos;

    // Events
    event TodoCreated(uint256 indexed id, address indexed owner, string content);
    event TodoUpdated(uint256 indexed id, string content);
    event TodoToggled(uint256 indexed id, bool isCompleted);
    event TodoDeleted(uint256 indexed id);

    constructor() Ownable(msg.sender) {}

    function createTodo(string memory _content) public returns (uint256) {
        require(bytes(_content).length > 0, "Content cannot be empty");
        
        _todoIds++;
        uint256 newTodoId = _todoIds;

        _todos[newTodoId] = Todo({
            id: newTodoId,
            content: _content,
            isCompleted: false,
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });

        _userTodos[msg.sender].push(newTodoId);

        emit TodoCreated(newTodoId, msg.sender, _content);
        return newTodoId;
    }

    function updateTodo(uint256 _id, string memory _content) public {
        require(_exists(_id), "Todo does not exist");
        require(_isOwner(_id), "Not the owner");
        require(bytes(_content).length > 0, "Content cannot be empty");

        _todos[_id].content = _content;
        _todos[_id].updatedAt = block.timestamp;

        emit TodoUpdated(_id, _content);
    }

    function toggleTodo(uint256 _id) public {
        require(_exists(_id), "Todo does not exist");
        require(_isOwner(_id), "Not the owner");

        _todos[_id].isCompleted = !_todos[_id].isCompleted;
        _todos[_id].updatedAt = block.timestamp;

        emit TodoToggled(_id, _todos[_id].isCompleted);
    }

    function deleteTodo(uint256 _id) public {
        require(_exists(_id), "Todo does not exist");
        require(_isOwner(_id), "Not the owner");

        // Remove from user's todo list
        uint256[] storage userTodoList = _userTodos[msg.sender];
        for (uint256 i = 0; i < userTodoList.length; i++) {
            if (userTodoList[i] == _id) {
                userTodoList[i] = userTodoList[userTodoList.length - 1];
                userTodoList.pop();
                break;
            }
        }

        delete _todos[_id];
        emit TodoDeleted(_id);
    }

    function getTodo(uint256 _id) public view returns (Todo memory) {
        require(_exists(_id), "Todo does not exist");
        require(_isOwner(_id), "Not the owner");
        return _todos[_id];
    }

    function getUserTodos() public view returns (Todo[] memory) {
        uint256[] memory userTodoIds = _userTodos[msg.sender];
        Todo[] memory todos = new Todo[](userTodoIds.length);

        for (uint256 i = 0; i < userTodoIds.length; i++) {
            todos[i] = _todos[userTodoIds[i]];
        }

        return todos;
    }

    function _exists(uint256 _id) internal view returns (bool) {
        return _todos[_id].createdAt != 0;
    }

    function _isOwner(uint256 _id) internal view returns (bool) {
        uint256[] memory userTodoIds = _userTodos[msg.sender];
        for (uint256 i = 0; i < userTodoIds.length; i++) {
            if (userTodoIds[i] == _id) {
                return true;
            }
        }
        return false;
    }
} 