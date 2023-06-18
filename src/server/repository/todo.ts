import {
  listAll,
  create,
  update,
  deleteTodo,
} from "@server/service/todo-service";
import { HttpNotFaundError } from "@server/infra/errors";

interface TodoRepositoryGetParams {
  page?: number;
  limit?: number;
}

interface TodoRepositoryGetOutput {
  todos: Todo[];
  total: number;
  pages: number;
}

const get = ({
  page,
  limit,
}: TodoRepositoryGetParams = {}): TodoRepositoryGetOutput => {
  const currentPage = page || 1;
  const currentLimit = limit || 10;
  const ALL_TODOS = listAll().reverse();

  const startIndex = (currentPage - 1) * currentLimit;
  const endIndex = currentPage * currentLimit;
  const paginatedTodos = ALL_TODOS.slice(startIndex, endIndex);
  const totalPages = Math.ceil(ALL_TODOS.length / currentLimit);

  return {
    total: ALL_TODOS.length,
    todos: paginatedTodos,
    pages: totalPages,
  };
};

const createByContent = async (content: string): Promise<Todo> => {
  const newTodo = create(content);

  return newTodo;
};

const toggleDone = async (id: string): Promise<Todo> => {
  const ALL_TODOS = listAll();
  const currentTodo = ALL_TODOS.find((todo) => todo.id === id);

  if (!currentTodo) throw new Error(`Todo not found with id ${id}`);

  const updatedTodo = update(id, {
    ...currentTodo,
    done: !currentTodo?.done,
  });

  return updatedTodo;
};

const deleteById = async (id: string): Promise<void> => {
  const ALL_TODOS = listAll();
  const currentTodo = ALL_TODOS.find((todo) => todo.id === id);

  if (!currentTodo) throw new HttpNotFaundError(`Todo not found with id ${id}`);
  deleteTodo(id);
};

export const TodoRepository = {
  get,
  createByContent,
  toggleDone,
  deleteById,
};

//Model/Schema
interface Todo {
  id: string;
  date: string;
  content: string;
  done: boolean;
}
