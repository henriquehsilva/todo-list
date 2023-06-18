import { z as schema } from "zod";

//Model/Schema
// interface Todo {
//   id: string;
//   date: string;
//   content: string;
//   done: boolean;
// }
export const TodoSchema = schema.object({
  id: schema.string().uuid(),
  content: schema.string(),
  date: schema.string(),
  done: schema.boolean(),
});

export type Todo = schema.infer<typeof TodoSchema>;
