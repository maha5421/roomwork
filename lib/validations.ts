import { z } from "zod";

export const addSpaceSchema = z.object({
  title: z.string().min(1, "Укажите название"),
  metro: z.string().min(1, "Укажите станцию метро"),
  price_per_hour: z.coerce.number().int().min(1, "Цена должна быть больше 0"),
  description: z.string().optional(),
  phone: z.string().optional(),
  tags: z.string().optional(), // через запятую, разберём на массив
  image1: z.string().optional(),
  image2: z.string().optional(),
  image3: z.string().optional(),
});

export type AddSpaceInput = z.infer<typeof addSpaceSchema>;
