import { z } from "zod";

export const signUpSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, "required field")
      .email("Inavlid Email Address"),
    username: z
      .string()
      .trim()
      .min(1, "required field")
      .regex(/^[a-zA-Z0-9_-]+$/, "Only letters, numbers, - and _ are allowed"),
    password: z
      .string()
      .trim()
      .min(1, "required field")
      .min(8, "Must be at least 8 characters"),

    confirmPassword: z.string().trim().min(1, "required field"),
  })
  .refine(
    (data) => {
      return data.password === data.confirmPassword;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

export type SignUpSchemaType = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  username: z.string().trim().min(1, "required field"),
  password: z.string().trim().min(1, "required field"),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;

// const imageSchema = z
//   .instanceof(File)
//   .refine(
//     (file) => {
//       const isImageType = file.type.startsWith("image/");
//       const hasNoType = file.type === "";
//       return isImageType || hasNoType;
//     },
//     {
//       message: "File must be an image or have no file type.",
//     }
//   )
//   .refine((file) => file.size <= 2 * 1024 * 1024, {
//     message: "File size must be less than or equal to 2MB.",
//   });

export const addProductSchema = z.object({
  name: z.string().trim().min(1, "required field"),
  price: z.string().min(1, "required field"),
  description: z.string().trim().min(1, "required field"),
  // image: z.string().trim().min(1, "required field"),
  // image: z.union([imageSchema, z.null()]).refine((file) => !file, {
  //   message: "Image file is required.",
  // }),
  stock: z.string().min(1, "required field"),
  category: z.string().trim().min(1, "required field"),
});

export type AddProductType = z.infer<typeof addProductSchema>;

export type AddProductActionValue = AddProductType & { imageUrl: string };
export type UpdateProductValue = AddProductType & {
  imageBlob: Blob;
  imageUrl: string;
};

export const userSchema = z.object({
  username: z.string().trim().min(1, "required field"),
  displayName: z.string().trim().min(1, "required field"),
  avatarBlob: z
    .any()
    .refine((data) => data !== null && data !== undefined, {
      message: "Avatar is required", // Custom error for missing field
    })
    .refine((data) => data instanceof Blob, {
      message: "Avatar must be a valid Blob object", // Custom error for invalid Blob
    }),
});

export type UserSchemaValue = z.infer<typeof userSchema>;
