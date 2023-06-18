import { todoController } from "@server/controller/todo";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  //eslint-disable-next-line no-console
  // console.log(req.headers);
  // res.status(200).json({ message: "Toggle Done!" });

  if (req.method === "PUT") {
    todoController.toggleDone(req, res);
    return;
  }

  res.status(405).json({
    error: {
      message: "Method not allowed",
    },
  });
}
