import { NextApiRequest, NextApiResponse } from "next";
import { z as schema } from "zod";
import { TodoRepository } from "@server/repository/todo";
import { HttpNotFaundError } from "@server/infra/errors";

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const query = req.query;
  const page = Number(query.page);
  const limit = Number(query.limit);

  if (query.page && isNaN(page)) {
    res.status(400).json({
      error: "page query parameter must be a number",
    });
    return;
  }
  if (query.limit && isNaN(limit)) {
    res.status(400).json({
      error: "limit query parameter must be a number",
    });
    return;
  }

  const output = TodoRepository.get({
    page,
    limit,
  });

  res.status(200).json({
    total: output.total,
    pages: output.pages,
    todos: output.todos,
  });
};

const TodoCreateBodySchema = schema.object({
  content: schema.string().min(1).max(100),
});
const create = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = TodoCreateBodySchema.safeParse(req.body);

  if (!body.success) {
    res.status(400).json({
      error: {
        message: "You need to provide a valid content for the todo",
        // description: body.error.issues,
      },
    });
    return;
  }

  const createdTodo = await TodoRepository.createByContent(body.data.content);

  res.status(201).json({
    todo: createdTodo,
  });
};

const toggleDone = async (req: NextApiRequest, res: NextApiResponse) => {
  const todoId = req.query.id;

  if (!todoId || typeof todoId !== "string") {
    res.status(400).json({
      error: {
        message: "You need to provide a valid id for the todo",
      },
    });
    return;
  }

  try {
    const updatedTodo = await TodoRepository.toggleDone(todoId);

    res.status(200).json({
      todo: updatedTodo,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({
        error: {
          message: error.message,
        },
      });
    }
  }
};

const deleteById = async (req: NextApiRequest, res: NextApiResponse) => {
  const QuerySchema = schema.object({
    id: schema.string().uuid().nonempty(),
  });
  const parseQuery = QuerySchema.safeParse(req.query);

  if (!parseQuery.success) {
    res.status(400).json({
      error: {
        message: "You need to provide a valid id for the todo",
      },
    });
    return;
  }

  try {
    const todoId = req.query.id as string;
    await TodoRepository.deleteById(todoId);

    res.status(204).end();
  } catch (error) {
    if (error instanceof HttpNotFaundError) {
      return res.status(error.status).json({
        error: {
          message: error.message,
        },
      });
    }
  }
  res.status(500).json({
    error: {
      message: "Internal server error",
    },
  });
};

export const todoController = {
  get,
  create,
  toggleDone,
  deleteById,
};
