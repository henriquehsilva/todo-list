import { NextApiRequest, NextApiResponse } from "next";
import { todoController } from "@server/controllers/todo-controller";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    // eslint-disable-next-line no-console
    console.error(`Method ${req.method} is not allowed`)
    res.status(405).json({
      message: "Method not allowed",
    });
    return;
  }

  todoController.get(req, res);
};

export default handler;
