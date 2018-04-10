import {
  todos,
  todoCtrl,
  newTitle,
  activeCount,
  filterType,
  editText
} from "./types";
import classNames from "classnames";

export const DemoView = () => (
  <>
    <section className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          autoFocus
          value={newTitle.$val}
          onKeyDown={todoCtrl.newTodoKeyDown}
        />
      </header>
      <section className="main">
        <input
          id="toggle-all"
          className="toggle-all"
          type="checkbox"
          onChange={e => todoCtrl.toggleAll(e)}
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul className="todo-list">
          {todos.$val.map(todo => {
            todo.refEditInput = todo.showing.$val ? (
              <input
                className="edit"
                value={editText.$val}
                onBlur={e => todoCtrl.editSubmit(todo)}
                onChange={e => todoCtrl.editChange(todo, e.target["value"])}
                onKeyDown={e => todoCtrl.editKeyDown(todo, e.key)}
              />
            ) : null;
            return todo.showing.$val ? (
              <li
                className={classNames({
                  completed: todo.completed.$val,
                  editing: todo.editing.$val
                })}
              >
                <div className="view">
                  <input
                    className="toggle"
                    type="checkbox"
                    checked={todo.completed.$val}
                    onChange={() => todoCtrl.toggle(todo)}
                  />
                  <label onDblClick={() => todoCtrl.editStart(todo)}>
                    {todo.title.$val}
                  </label>
                  <button
                    className="destroy"
                    onClick={() => todoCtrl.remove(todo)}
                  />
                </div>
                {todo.refEditInput}
              </li>
            ) : null;
          })}
        </ul>
      </section>
      <footer className="footer">
        <span className="todo-count">
          <strong>{activeCount.$val}</strong>
          {activeCount.$val > 1 ? " items" : " item"} left
        </span>
        <ul className="filters">
          <li>
            <a
              className={classNames({ selected: filterType.$val == "" })}
              href="#/"
            >
              All
            </a>
          </li>
          <li>
            <a
              className={classNames({ selected: filterType.$val == "active" })}
              href="#/active"
            >
              Active
            </a>
          </li>
          <li>
            <a
              className={classNames({
                selected: filterType.$val == "completed"
              })}
              href="#/completed"
            >
              Completed
            </a>
          </li>
        </ul>
        <button className="clear-completed" onClick={todoCtrl.clearCompleted}>
          Clear completed
        </button>
      </footer>
    </section>
    <footer className="info">
      <p>Double-click to edit a todo</p>
      <p>
        Template by <a href="https://github.com/ismail-codar">İsmail Codar</a>
      </p>
      <p>
        Created by <a href="http://todomvc.com">you</a>
      </p>
      <p>
        Part of <a href="http://todomvc.com">TodoMVC</a>
      </p>
    </footer>
  </>
);
