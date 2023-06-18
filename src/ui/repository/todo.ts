import { z as schema } from "zod";
import { Todo, TodoSchema } from "@ui/schema/todo";

interface TodoRepositoryGetParams {
  page: number;
  limit: number;
}
interface TodoRepositoryGetOutput {
  todos: Todo[];
  total: number;
  pages: number;
}

const get = ({
  page,
  limit,
}: TodoRepositoryGetParams): Promise<TodoRepositoryGetOutput> => {
  return fetch(`/api/todos?page=${page}&limit=${limit}`).then(
    async (response) => {
      const todosString = await response.text();
      const responseParsed = parseTodosFromServer(JSON.parse(todosString));

      return {
        todos: responseParsed.todos,
        total: responseParsed.total,
        pages: responseParsed.pages,
      };
    }
  );
};

const createByContent = async (content: string): Promise<Todo> => {
  const response = await fetch("/api/todos", {
    method: "POST",
    body: JSON.stringify({
      content,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const serverResponse = await response.json();
    const ServerResponseSchema = schema.object({ todo: TodoSchema });

    const serverResponseParsed = ServerResponseSchema.safeParse(serverResponse);
    if (!serverResponseParsed.success) {
      throw new Error("Failed to create TODO :(");
    }

    const todo = serverResponseParsed.data.todo;
    return todo;
  }

  throw new Error("Error creating todo");
};

const toggleDone = async (todoId: string): Promise<Todo> => {
  const response = await fetch(`/api/todos/${todoId}/toggle-done`, {
    method: "PUT",
  });

  if (response.ok) {
    const serverResponse = await response.json();
    const ServerResponseSchema = schema.object({ todo: TodoSchema });

    const serverResponseParsed = ServerResponseSchema.safeParse(serverResponse);
    if (!serverResponseParsed.success) {
      throw new Error("Failed to toggle todo :(");
    }

    const todo = serverResponseParsed.data.todo;
    return todo;
  }

  throw new Error("Error toggling todo");
};

const deleteTodo = async (todoId: string): Promise<void> => {
  const response = await fetch(`/api/todos/${todoId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    return;
  }

  throw new Error("Error deleting todo");
};

export const todoRepository = {
  get,
  createByContent,
  toggleDone,
  deleteTodo,
};

const parseTodosFromServer = (
  responseBody: Todo[]
): { total: number; pages: number; todos: Array<Todo> } => {
  if (
    responseBody !== null &&
    typeof responseBody === "object" &&
    "todos" in responseBody &&
    "total" in responseBody &&
    "pages" in responseBody &&
    Array.isArray(responseBody.todos)
  ) {
    return {
      total: Number(responseBody.total),
      pages: Number(responseBody.pages),
      todos: responseBody.todos.map((todo: Todo) => {
        if (todo == null && typeof todo !== "object") {
          throw new Error("Invalid todo from API");
        }
        const { id, content, date, done } = todo as Todo;

        return {
          id,
          content,
          date,
          done,
        };
      }),
    };
  }
  return {
    pages: 1,
    total: 0,
    todos: [],
  };
};
