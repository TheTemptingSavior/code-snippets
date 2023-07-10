import prisma from "@/lib/prisma";
import {Tag} from ".prisma/client";
import {makeSlug} from "@/lib/utils";

export type TagType = {
  id: number;
  name: string;
  slug: string;
  uses: number,
}

export type CreateTagType = {
  name: string;
}

export type UpdateTagType = {
  name: string;
}

export const getTags = async (): Promise<TagType[]> => {
  const data = await prisma.tag.findMany({
    include: {
      _count: {
        select: { snippets: true }
      }
    }
  });
  return data.map((t) => ({id: t.id, name: t.name, slug: t.slug, uses: t._count.snippets}));
};

export const getTag = async (id: number): Promise<TagType> => {
  const data = await prisma.tag.findFirstOrThrow({
    where: { id: id },
    include: {
      _count: {
        select: { snippets: true }
      }
    }
  });
  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    uses: data._count.snippets
  }
}

export const createTag = async (data: CreateTagType): Promise<Tag> => {
  const tagSlug: string = makeSlug(data.name);
  return prisma.tag.create({
    data: {
      name: data.name,
      slug: tagSlug,
    }
  });
}

export const deleteTag = async (id: number): Promise<Tag> => {
  return prisma.tag.delete({
    where: { id: id }
  });
}

export const updateTag = async (id: number, data: UpdateTagType): Promise<Tag | never> => {
  return prisma.tag.update({
    where: { id: id },
    data: {
      name: data.name,
      slug: makeSlug(data.name)
    }
  })
}
