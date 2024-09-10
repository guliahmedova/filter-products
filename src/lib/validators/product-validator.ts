import { z } from "zod";

export const AVALIABLE_SORT = ["", "asc", "desc"] as const;

export const ProductFilterValidator = z.object({
  weight: z.number(),
  sort: z.enum(AVALIABLE_SORT),
  title: z.string(),
  discountPercentage: z.number(),
  rating: z.number(),
  brand: z.string(),
  minimumOrderQuantity: z.number(),
});

export type ProductState = Omit<
  z.infer<typeof ProductFilterValidator>,
  "weight"
>;
