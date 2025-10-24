import { z } from "zod";

export const CreateUserSchema = z.object({
  email: z
    .string()
    .email("El email no es válido")
    .min(6, "El email es obligatorio")
    .max(10, "El email no puede tener más de 10 caracteres"),
  bio: z
    .string()
    .min(1, "La biografía es obligatoria")
    .max(6, "La biografía no puede tener más de 6 caracteres")
    .optional(),
});

export const UpdateUserSchema = CreateUserSchema.partial();

export const CreatePostSchema = z.object({
  title: z
    .string()
    .min(2, "El título es obligatorio")
    .max(10, "El título no puede tener más de 10 caracteres"),
  userId: z.coerce.number()
    .positive("El ID de usuario debe ser un número positivo")
    .int("El ID de usuario debe ser un número entero"),
});

export function validateFormData(schema, data) {
  const rawData =
    data instanceof FormData ? Object.fromEntries(data.entries()) : data;

  const validation = schema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: "Datos inválidos",
      errors: validation.error.issues.map(
        (e) => `${e.path.join(".")} - ${e.message}`
      ),
    };
  }

  return { success: true, data: validation.data };
}

export const UpdatePostSchema = z.object({
  title: z
    .string()
    .min(2, "El título es obligatorio")
    .max(10, "El título no puede tener más de 10 caracteres"),
});