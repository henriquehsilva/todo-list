import { todoRepository } from "@ui/repository/todo";
import { Todo } from "@ui/schema/todo";
import { z as schema } from "zod";
interface TodoControllerGetParams {
  page: number;
}

const get = async (params: TodoControllerGetParams) => {
  return todoRepository.get({
    page: params.page,
    limit: 10,
  });
};

const filterTodosByContent = <Todo>(
  todos: Array<Todo & { content?: string }>,
  search: string
): Todo[] => {
  const homeTodos = todos.filter((todo) => {
    const searchNormalized = search.toLowerCase();
    const contentNormalized = todo.content.toLowerCase();
    return contentNormalized.includes(searchNormalized);
  });
  return homeTodos;
};

interface TodoControllerCreateParams {
  content?: string;
  onError: () => void;
  onSuccess: (todo: Todo) => void;
}
const create = async ({
  content,
  onError,
  onSuccess,
}: TodoControllerCreateParams) => {
  const parsedParams = schema.string().nonempty().safeParse(content);
  if (!parsedParams.success) {
    onError();
    return;
  }
  todoRepository
    .createByContent(parsedParams.data)
    .then((newTodo) => {
      onSuccess(newTodo);
    })
    .catch(() => {
      onError();
    });
};

interface TodoControllerToggleDoneParams {
  todoId: string;
  updateTodoOnScreen: () => void;
}
const toggleDone = async ({
  todoId,
  updateTodoOnScreen,
}: TodoControllerToggleDoneParams) => {
  todoRepository.toggleDone(todoId).then(() => {
    updateTodoOnScreen();
  });
};

const deleteById = async (todoId: string) => {
  todoRepository.deleteTodo(todoId);
};

export const todoController = {
  get,
  filterTodosByContent,
  create,
  toggleDone,
  deleteById,
};
