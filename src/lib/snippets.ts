import prisma from "@/lib/prisma";
import {Tag, TagsOnSnippet} from ".prisma/client";
import {Snippet} from "@prisma/client";
import {makeSlug} from "@/lib/utils";

export type CreateSnippet = {
  title: string;
  description: string | null;
  content: string;
  language: string;
  published: boolean;
  authorId: number | null;
  tags: string[] | null;
};

export type UpdateSnippet = {
  title?: string;
  content?: string;
  published?: boolean;
  tags?: string[];
}

export type BareSnippetType = {
  id: number;
  title: string;
  description: string | null;
  language: string;
  published: boolean;
  tags: Tag[];
  pinned: boolean;
}

export type SnippetType = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  language: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
  pinned: boolean;
  viewCount: number;
  author: { id: number, username: string } | null;
  authorId: number | null;
  tags: Tag[];
}

export const getSnippets = async (): Promise<SnippetType[]> => {
  const data = await prisma.snippet.findMany({
    include: {
      author: { select: { id: true, username: true } },
      tags: { include: { tag: true } }
    }
  });

  return data.map((snippet) => {
    return {
      ...snippet,
      tags: snippet.tags
        .map((tag: TagsOnSnippet & {tag: Tag}) => tag.tag)
        .sort((a: Tag, b: Tag) => a.slug > b.slug ? -1 : 1)
    }
  });
}

export const getSnippet = async (id: number): Promise<SnippetType> => {
  const data = await prisma.snippet.findFirstOrThrow({
    where: { id: id },
    include: {
      author: { select: { id: true, username: true } },
      tags: { select: { tag: true } }
    }
  });

  return {
    ...data,
    tags: data.tags
      .map((tag) => tag.tag)
      .sort((a: Tag, b: Tag) => a.slug > b.slug ? -1 : 1)
  };
}

export const deleteSnippet = async (id: number): Promise<Snippet> => {
  return prisma.snippet.delete({
    where: { id: id }
  });
}

export const createSnippet = async (data: CreateSnippet): Promise<SnippetType> => {
  const authorObject = data.authorId ? { connect: { id: data.authorId } } : {};
  console.log("Creating new snippet from data:", data);
  process.stderr.write(`Creating new snippet from data: ${data}`);

  const newSnippet = await prisma.snippet.create({
    include: {
      author: { select: { id: true, username: true } },
      tags: { select: { tag: true } }
    },
    data: {
      title: data.title,
      slug: makeSlug(data.title),
      description: data.description,
      language: data.language,
      content: data.content,
      published: data.published,
      viewCount: 0,
      author: authorObject,
      tags: {
        create: data.tags?.map((tag) => {
          return {
            tag: {
              connectOrCreate: {
                where: { slug: makeSlug(tag) },
                create: { name: tag, slug: makeSlug(tag) }
              }
            }
          }
        })
      }
    }
  });

  return {
    ...newSnippet,
    tags: newSnippet.tags
      .map((tag) => tag.tag)
      .sort((a: Tag, b: Tag) => a.slug > b.slug ? -1 : 1)
  }
};


export const updateSnippet = async (snippetId: number, data: UpdateSnippet): Promise<SnippetType> => {
  const existingSnippet = await getSnippet(snippetId);

  const removedTags: Tag[] = existingSnippet.tags.filter((tag) => !data.tags?.includes(tag.name));

  const updatedSnippet = await prisma.$transaction(async (tx) => {
    await prisma.tagsOnSnippet.deleteMany({
      where: {
        snippetId: existingSnippet.id,
        tagId: {
          in: removedTags.map((tag) => tag.id)
        }
      }
    });
    return prisma.snippet.update({
      where: {id: snippetId},
      include: {
        author: { select: { id: true, username: true } },
        tags: { select: { tag: true } }
      },
      data: {
        title: data.title ? data.title : existingSnippet.title,
        content: data.content ? data.content : existingSnippet.content,
        published: data.published ? data.published : existingSnippet.published,
      }
    });
  });

  return {
    ...updatedSnippet,
    tags: updatedSnippet.tags
      .map((tag) => tag.tag)
      .sort((a: Tag, b: Tag) => a.slug > b.slug ? -1 : 1)
  }
};
