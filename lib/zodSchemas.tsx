import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(1, "Price must be at least 1"),
  status: z.enum(["draft", "published", "archived"]),
  category: z.enum(["men", "women", "kids"]),
  isFeatured: z.coerce.boolean(),
  images: z.array(z.string()).min(1, "At least one image is required"),
  sizes: z.array(
    z.object({
      name: z.string().min(1, "Size name is required"),
      stock: z.coerce.number().min(0, "Stock must be 0 or more"),
    })
  ).min(1, "At least one size is required"),
});
export const bannerSchema = z.object({
  title: z.string(),
  imageString: z.string(),
});