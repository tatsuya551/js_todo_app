import { TodoListModel } from "./model/TodoListModel.js";
import { TodoItemModel } from "./model/TodoItemModel.js";
import { TodoListView } from "./view/TodoListView.js";
import { render } from "./view/html-util.js";

export class App {
  constructor({ formElement, formInputElement, todoCountElement, todoListContainerElement }) {
    this.todoListView = new TodoListView();
    this.todoListModel = new TodoListModel([]);
    this.formElement = formElement;
    this.formInputElement = formInputElement;
    this.todoCountElement = todoCountElement;
    this.todoListContainerElement = todoListContainerElement;
    // ハンドラ呼び出しで、`this`が変わらないように固定する
    // `this`が常に`App`のインスタンスを示すようにする
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleAdd(title) {
    this.todoListModel.addTodo(new TodoItemModel({ title, completed: false }));
  }

  handleUpdate({ id, completed }) {
    this.todoListModel.updateTodo({ id, completed });
  }

  handleDelete({ id }) {
    this.todoListModel.deleteTodo({ id });
  }

  handleSubmit(event) {
    event.preventDefault();
    const inputElement = this.formInputElement
    this.handleAdd(inputElement.value);
    inputElement.value = "";
  }

  handleChange() {
    const todoCountElement = this.todoCountElement;
    const todoListContainerElement = this.todoListContainerElement;
    const todoItems = this.todoListModel.getTodoItems();
    const todoListElement = this.todoListView.createElement(todoItems, {
      // Appに定義したリスナー関数を呼び出す
      onUpdateTodo: ({ id, completed }) => {
        this.handleUpdate({ id, completed });
      },
      onDeleteTodo: ({ id }) => {
        this.handleDelete({ id });
      }
    });
    render(todoListElement, todoListContainerElement);
    todoCountElement.textContent = `Todoアイテム数: ${this.todoListModel.getTotalCount()}`;
  }

  // アプリとDOMの紐づけを登録する関数
  mount() {
    this.todoListModel.onChange(this.handleChange);
    this.formElement.addEventListener("submit", this.handleSubmit)
  }

  unmount() {
    this.todoListModel.offChange(this.handleChange)
    this.formElement.removeEventListener("submit", this.handleSubmit);
  }
}