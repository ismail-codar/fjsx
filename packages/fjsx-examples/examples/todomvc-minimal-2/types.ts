import { fjsx, FJsxValue } from "fjsx";
import { Utils } from "../util";

export interface ITodoModel {
  completed$: boolean;
  editing$: boolean;
  showing$: boolean;
  title$: string;
  refEditInput?: HTMLElement;
  uid: string;
}

export const todos$: ITodoModel[] = [];
export var newTitle$ = "";
export var editText$ = "";

export const todoCtrl = {
  newTodoKeyDown(e: KeyboardEvent) {
    if (e.key == "Enter") {
      const todoItem: ITodoModel = {
        completed$: false,
        editing$: false,
        showing$: true,
        title$: e.target["value"],
        uid: Utils.uuid()
      };
      completedCount$.freezed = true;
      initCompletedCalculations(todoItem);
      todos$.push(todoItem);
      completedCount$.freezed = false;
      newTitle$ = "";
      saveTodos();
    } else if (e.key == "Escape") {
      newTitle$ = "";
    }
  },
  editStart(todoItem: ITodoModel) {
    todoItem.editing$ = true;
    todoItem.refEditInput.focus();
    editText$ = todoItem.title$;
  },
  editSubmit(todoItem: ITodoModel) {
    if (!editText$) return;
    todoItem.title$ = editText$;
    todoItem.editing$ = false;
  },
  editChange(todoItem: ITodoModel, value: string) {
    if (todoItem.editing$) {
      editText$ = value;
    }
  },
  editCancel(todoItem: ITodoModel) {
    editText$ = "";
    todoItem.editing$ = false;
  },
  editKeyDown(todoItem: ITodoModel, key: string) {
    if (key == "Escape") {
      todoCtrl.editCancel(todoItem);
    } else if (key == "Enter") {
      todoCtrl.editSubmit(todoItem);
    }
  },
  toggleAll(event: Event) {
    var checked = event.target["checked"];
    todos$.forEach(todo => {
      if (todo.completed$ != checked) todo.completed$ = checked;
    });
    saveTodos();
  },
  toggle(todoItem: ITodoModel) {
    todoItem.completed$ = !todoItem.completed$;
    saveTodos();
  },
  remove(todoItem: ITodoModel) {
    todos$.splice(todos$.indexOf(todoItem), 1);
    saveTodos();
  },
  clearCompleted() {
    const removes = [];
    todos$.forEach(todo => {
      if (todo.completed$) removes.push(todo);
    });
    while (removes.length) todos$.splice(todos$.indexOf(removes.pop()), 1);
    saveTodos();
  },
  filterBy(filter) {
    todos$.forEach(todo => {
      if (filter === "") todo.showing$ = true;
      else if (filter === "active") todo.showing$ = todo.completed$ == false;
      else if (filter === "completed") todo.showing$ = todo.completed$ == true;
    });
  }
};

//////// footer computations ////////
var totalCount$ = todos$.length;
var completedCount$ = fjsx.value(0, true);
export const activeCount$ = totalCount$ - completedCount$.$val;

fjsx.on(todos$, "itemadded", e => {
  totalCount$ = totalCount$ + 1;
});

fjsx.on(todos$, "itemremoved", e => {
  totalCount$ = totalCount$ - 1;
});

const initCompletedCalculations = (todoItem: ITodoModel) => {
  fjsx.compute(() => {
    if (!completedCount$.freezed)
      completedCount$(completedCount$.$val + (todoItem.completed$ ? 1 : -1));
  }, todoItem.completed$);
};

//////// save-load data ////////
const saveTodos = () => {
  Utils.store("FJSX_TODOMVC2", todos$);
};
const savedTodos: ITodoModel[] = Utils.store("FJSX_TODOMVC2");
savedTodos.forEach((item: ITodoModel) => {
  const todoItem: ITodoModel = {
    completed$: item["completed$"],
    editing$: item["editing$"],
    showing$: true,
    title$: item["title$"],
    uid: item.uid
  };
  initCompletedCalculations(todoItem);
  todos$.push(todoItem);
});
completedCount$(savedTodos.filter(item => item["completed$"]).length);
completedCount$.freezed = false;

//////// page router ////////
export var filterType$ = "";
fjsx.compute(() => {
  todoCtrl.filterBy(filterType$);
}, filterType$);
const filterByHash = () => {
  filterType$ = window.location.hash.substr(2);
};
window.addEventListener("hashchange", filterByHash, false);
filterByHash();
