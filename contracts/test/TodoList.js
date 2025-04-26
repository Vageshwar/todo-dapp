const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TodoList", function () {
  let TodoList;
  let todoList;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    TodoList = await ethers.getContractFactory("TodoList");
    todoList = await TodoList.deploy();
  });

  describe("Todo Operations", function () {
    it("Should create a new todo", async function () {
      const tx = await todoList.createTodo("Test todo");
      const receipt = await tx.wait();
      
      const event = receipt.logs[0];
      const args = event.args;

      expect(args.content).to.equal("Test todo");
      expect(args.owner).to.equal(owner.address);
      
      const todo = await todoList.getTodo(args.id);
      expect(todo.content).to.equal("Test todo");
      expect(todo.isCompleted).to.equal(false);
    });

    it("Should not create todo with empty content", async function () {
      await expect(todoList.createTodo("")).to.be.revertedWith("Content cannot be empty");
    });

    it("Should update todo", async function () {
      const tx = await todoList.createTodo("Test todo");
      const receipt = await tx.wait();
      const todoId = receipt.logs[0].args.id;

      await todoList.updateTodo(todoId, "Updated todo");
      const todo = await todoList.getTodo(todoId);
      expect(todo.content).to.equal("Updated todo");
    });

    it("Should toggle todo status", async function () {
      const tx = await todoList.createTodo("Test todo");
      const receipt = await tx.wait();
      const todoId = receipt.logs[0].args.id;

      await todoList.toggleTodo(todoId);
      let todo = await todoList.getTodo(todoId);
      expect(todo.isCompleted).to.equal(true);

      await todoList.toggleTodo(todoId);
      todo = await todoList.getTodo(todoId);
      expect(todo.isCompleted).to.equal(false);
    });

    it("Should delete todo", async function () {
      const tx = await todoList.createTodo("Test todo");
      const receipt = await tx.wait();
      const todoId = receipt.logs[0].args.id;

      await todoList.deleteTodo(todoId);
      await expect(todoList.getTodo(todoId)).to.be.revertedWith("Todo does not exist");
    });

    it("Should get all user todos", async function () {
      await todoList.createTodo("Todo 1");
      await todoList.createTodo("Todo 2");
      await todoList.createTodo("Todo 3");

      const todos = await todoList.getUserTodos();
      expect(todos.length).to.equal(3);
      expect(todos[0].content).to.equal("Todo 1");
      expect(todos[1].content).to.equal("Todo 2");
      expect(todos[2].content).to.equal("Todo 3");
    });

    it("Should not allow non-owners to modify todos", async function () {
      const tx = await todoList.createTodo("Test todo");
      const receipt = await tx.wait();
      const todoId = receipt.logs[0].args.id;

      await expect(todoList.connect(addr1).updateTodo(todoId, "Hacked todo"))
        .to.be.revertedWith("Not the owner");
      
      await expect(todoList.connect(addr1).toggleTodo(todoId))
        .to.be.revertedWith("Not the owner");
      
      await expect(todoList.connect(addr1).deleteTodo(todoId))
        .to.be.revertedWith("Not the owner");
    });
  });
}); 