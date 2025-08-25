export type Task = {
  id: number;
  taskable_id: string;
  taskable_type: string;
  description: string;
  price: number | string;
};

export type TaskFillable = Pick<Task, "description" | "price">;
