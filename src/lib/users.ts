import prisma from "@/lib/prisma";
import {User} from ".prisma/client";


export type UserType = {
  id: number;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date | null
}
export type CreateUserType = {
  username: string;
  password: string;
}
export type UpdateUserType = {
  username: string;
  password: string
}

export const getUsers = async (): Promise<UserType[]> => {
  return prisma.user.findMany({
    select: {
      id: true,
      username: true,
      createdAt: true,
      updatedAt: true,
      lastLogin: true
    }
  });
}

export const getUser = async (id: number): Promise<UserType> => {
  return prisma.user.findFirstOrThrow({
    where: { id: id }
  });
}

export const createUser = async (data: CreateUserType): Promise<User | never> => {
  return prisma.user.create({
    data: {
      username: data.username,
      password: data.password
    }
  });
}

export const deleteUser = async (id: number): Promise<User | never> => {
  return prisma.user.delete({
    where: { id: id }
  })
}

export const updateUser = async (id: number, data: UpdateUserType): Promise<User | never> => {
  return prisma.user.update({
    where: { id: id },
    data: {
      username: data.username,
      password: data.password
    }
  })
}

export const totalUsers = async (): Promise<number> => {
  return prisma.user.count();
}
