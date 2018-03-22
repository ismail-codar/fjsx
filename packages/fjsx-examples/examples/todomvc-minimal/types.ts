import { fjsx, FJsxValue } from "fjsx";
import { Utils } from "./utils";

export interface ITodoModel {
  completed: FJsxValue<boolean>;
  editing: FJsxValue<boolean>;
  showing: FJsxValue<boolean>;
  title: FJsxValue<string>;
  refEditInput?: HTMLElement;
  uid: string;
}

//////// data model ////////
export const todos = fjsx.array<ITodoModel>([]);
export const newTitle = fjsx.value("");
export const editText = fjsx.value("");

//////// controller ////////
export const todoCtrl = {
  newTodoKeyDown(e: KeyboardEvent) {
    if (e.key == "Enter") {
      const todoItem: ITodoModel = {
        completed: fjsx.value(false),
        editing: fjsx.value(false),
        showing: fjsx.value(true),
        title: fjsx.value(e.target["value"]),
        uid: Utils.uuid()
      };
      completedCount.freezed = true;
      initCompletedCalculations(todoItem);
      todos.$val.push(todoItem);
      completedCount.freezed = false;
      newTitle("");
      saveTodos();
    } else if (e.key == "Escape") {
      newTitle("");
    }
  },
  editStart(todoItem: ITodoModel) {
    todoItem.editing(true);
    todoItem.refEditInput.focus();
    editText(todoItem.title.$val);
  },
  editSubmit(todoItem: ITodoModel) {
    if (!editText.$val) return;
    todoItem.title(editText.$val);
    todoItem.editing(false);
  },
  editChange(todoItem: ITodoModel, value: string) {
    if (todoItem.editing.$val) {
      editText(value);
    }
  },
  editCancel(todoItem: ITodoModel) {
    editText("");
    todoItem.editing(false);
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
    todos.$val.forEach(
      todo => todo.completed.$val != checked && todo.completed(checked)
    );
    saveTodos();
  },
  toggle(todoItem: ITodoModel) {
    todoItem.completed(!todoItem.completed.$val);
    saveTodos();
  },
  remove(todoItem: ITodoModel) {
    todos.$val.splice(todos.$val.indexOf(todoItem), 1);
    saveTodos();
  },
  clearCompleted() {
    const removes = [];
    todos.$val.forEach(todo => {
      if (todo.completed.$val) removes.push(todo);
    });
    while (removes.length)
      todos.$val.splice(todos.$val.indexOf(removes.pop()), 1);
    saveTodos();
  },
  filterBy(filter: "active" | "completed" | "") {
    todos.$val.forEach(todo => {
      if (filter === "") todo.showing(true);
      else if (filter === "active") todo.showing(todo.completed.$val == false);
      else if (filter === "completed")
        todo.showing(todo.completed.$val == true);
    });
  }
};

//////// footer computations ////////
const totalCount = fjsx.value(todos.$val.length);
const completedCount = fjsx.value(0, true);
export const activeCount = fjsx.value(0);
// activeCount = totalCount - completedCount
fjsx.compute(
  () => activeCount(totalCount.$val - completedCount.$val),
  totalCount,
  completedCount
);

todos.on("itemadded", e => {
  totalCount(totalCount.$val + 1);
});

todos.on("itemremoved", e => {
  totalCount(totalCount.$val - 1);
});

const initCompletedCalculations = (todoItem: ITodoModel) => {
  fjsx.compute(() => {
    if (!completedCount.freezed)
      completedCount(completedCount.$val + (todoItem.completed.$val ? 1 : -1));
  }, todoItem.completed);
};

//////// save-load data ////////
const saveTodos = () => {
  Utils.store("FJSX_TODOMVC", todos);
};
const savedTodos: any[] = Utils.store("FJSX_TODOMVC");
savedTodos.forEach(item => {
  const todoItem: ITodoModel = {
    completed: fjsx.value(item.completed),
    editing: fjsx.value(item.editing),
    showing: fjsx.value(true),
    title: fjsx.value(item.title),
    uid: item.uid
  };
  initCompletedCalculations(todoItem);
  todos.$val.push(todoItem);
});
completedCount(savedTodos.filter(item => item.completed).length);
completedCount.freezed = false;

//////// page router ////////
export const filterType = fjsx.value("");
fjsx.compute(() => {
  todoCtrl.filterBy(filterType.$val as any);
}, filterType);
const filterByHash = () => {
  filterType(window.location.hash.substr(2));
};
window.addEventListener("hashchange", filterByHash, false);
filterByHash();
