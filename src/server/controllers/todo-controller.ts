import { listAll } from "@server/service/todo-service";
import { NextApiRequest, NextApiResponse } from "next";

const get = async (_: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({
    todos: listAll(),
  });
};

export const todoController = {
  get,
};
