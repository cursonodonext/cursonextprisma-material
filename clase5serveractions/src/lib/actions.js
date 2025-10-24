"use server";
import prisma from "@/lib/prisma";
import {
  CreateUserSchema,
  validateFormData,
  CreatePostSchema,
  UpdatePostSchema,
} from "../lib/schemas";
import { revalidatePath } from "next/cache";

export async function getAllUsers() {
  try {
    const users = await prisma.user.findMany({
      include: { profile: true, posts: true },
    });
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}
export async function createPost(formData) {
  //validacion con helper function
  const result = validateFormData(CreatePostSchema, formData);
  if (!result.success) return result;

  const { title, userId } = result.data;

  try {
    const post = await prisma.post.create({
      data: { title, userId },
      include: { user: true, postTags: { include: { tag: true } } },
    });
    revalidatePath("/posts");
    revalidatePath("/");
    return {
      success: true,
      data: post,
      message: "Post creado exitosamente",
    };
  } catch (error) {
    console.error("Error creando post:", error);
    return { success: false, message: "Error creando post" };
  }
}
export async function createUser(formData) {
  const result = validateFormData(CreateUserSchema, formData);
  if (!result.success) return result;

  const { email, bio } = result.data;

  try {
    const user = await prisma.user.create({
      data: { email, profile: bio ? { create: { bio } } : undefined },
      include: { profile: true, posts: true },
    });

    revalidatePath("/users");
    return {
      success: true,
      data: user,
      message: "Usuario creado exitosamente",
    };
  } catch (error) {
    console.error("Error creando usuario:", error);
    return { success: false, message: "Error creando usuario" };
  }
}

export async function deletePost(id) {
  try {
    await prisma.post.delete({
      where: { id: Number(id) },
    });
    revalidatePath("/posts");
    revalidatePath("/");
    return {
      success: true,
      data: null,
      message: "Post eliminado exitosamente",
    };
  } catch (error) {
    console.error("Error eliminando post:", error);
    return { success: false, message: "Error eliminando post" };
  }
}

export async function updatePost(id, formData) {
  const result = validateFormData(UpdatePostSchema, formData);
  if (!result.success) return result;
  const { title } = result.data;

  try {
    const update = await prisma.post.update({
      where: { id: Number(id) },
      data: { title },
      include: { user: true, postTags: { include: { tag: true } } },
    });
    revalidatePath("/posts");
    revalidatePath("/");
    return {
      success: true,
      data: update,
      message: "Post actualizado exitosamente",
    };
  } catch (error) {
    console.error("Error actualizando post:", error);
    return { success: false, message: "Error actualizando post" };
  }
}

export async function getUserById(id) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: {
        profile: true,
        posts: { include: { postTags: { include: { tag: true } } } },
      },
    });
    return user
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
}
