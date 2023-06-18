import * as fs from "node:fs";
import { v4 as uuid } from "uuid";
import Todo from "@server/models/todo";

const DB_FILE_PATH = "src/server/db/todos.json";

export const create = (content: string): Todo => {
  const todo: Todo = {
    id: uuid(),
    date: new Date().toLocaleDateString(),
    content: content,
    done: false,
  };

  const todos: Array<Todo> = [...listAll(), todo];

  fs.writeFileSync(
    DB_FILE_PATH,
    JSON.stringify(
      {
        todos,
      },
      null,
      2
    )
  );

  return todo;
};

export const update = (id: string, partialTodo: Todo): Todo => {
  let updatedTodo = null;

  const todos = listAll();

  todos.map((currentTodo) => {
    const isUpdatedTodo = currentTodo.id === id;
    if (isUpdatedTodo) {
      updatedTodo = Object.assign(currentTodo, partialTodo);
    }
  });

  // todos = [...listAll(), updatedTodo];

  fs.writeFileSync(
    DB_FILE_PATH,
    JSON.stringify(
      {
        todos,
      },
      null,
      2
    )
  );

  if (!updatedTodo) {
    throw new Error("Please, check the user id and try again.");
  }

  return updatedTodo;
};

export const deleteTodo = (id: string) => {
  const todos = listAll();

  const todosWithoutOne = todos.filter((todo) => {
    if (todo.id === id) {
      return false;
    }
    return true;
  });

  fs.writeFileSync(
    DB_FILE_PATH,
    JSON.stringify(
      {
        todos: todosWithoutOne,
      },
      null,
      2
    )
  );
};

export const listAll = (): Array<Todo> => {
  const dbString = fs.readFileSync(DB_FILE_PATH, "utf-8");
  const db = JSON.parse(dbString || '{"todos": []}');
  if (!db.todos) {
    return [];
  }
  return [...db.todos];
};
