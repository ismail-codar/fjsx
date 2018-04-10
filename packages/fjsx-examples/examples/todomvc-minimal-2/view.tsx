import {
  todos$,
  todoCtrl,
  newTitle$,
  activeCount$,
  filterType$,
  editText$
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
          value={newTitle$}
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
          {todos$.map((
            // @track_keys completed|editing|showing|title
            todo
          ) => {
            todo.refEditInput = todo.showing$ ? (
              <input
                className="edit"
                value={editText$}
                onBlur={e => todoCtrl.editSubmit(todo)}
                onChange={e => todoCtrl.editChange(todo, e.target["value"])}
                onKeyDown={e => todoCtrl.editKeyDown(todo, e.key)}
              />
            ) : null;
            return todo.showing$ ? (
              <li
                className={classNames({
                  completed: todo.completed$,
                  editing: todo.editing$
                })}
              >
                <div className="view">
                  <input
                    className="toggle"
                    type="checkbox"
                    checked={todo.completed$}
                    onChange={() => todoCtrl.toggle(todo)}
                  />
                  <label onDblClick={() => todoCtrl.editStart(todo)}>
                    {todo.title$}
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
          <strong>{activeCount$}</strong>
          {activeCount$ > 1 ? " items" : " item"} left
        </span>
        <ul className="filters">
          <li>
            <a
              className={classNames({ selected: filterType$ == "" })}
              href="#/"
            >
              All
            </a>
          </li>
          <li>
            <a
              className={classNames({ selected: filterType$ == "active" })}
              href="#/active"
            >
              Active
            </a>
          </li>
          <li>
            <a
              className={classNames({
                selected: filterType$ == "completed"
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
