import {NextApiRequest, NextApiResponse} from "next";
import prisma from "@/lib/prisma";
import {getSnippets, SnippetType} from "@/lib/snippets";
import {Prisma} from "@prisma/client";
import TagsOnSnippetListRelationFilter = Prisma.TagsOnSnippetListRelationFilter;
import {isNumber} from "is-what";
import {makeSlug} from "@/lib/utils";


const createTagQuery = (query: string[][]): TagsOnSnippetListRelationFilter => {
  const tagsOnly: string[][] = query.filter((q) => q[0] === 'tag' && q.length === 2);
  if (!tagsOnly.length) {
    return {}
  }

  return {
    some: {
      tag: {
        slug: {
          in: tagsOnly.map((q) => makeSlug(q[1]))
        }
      }
    }
  };
}

const createTitleQuery = (query: string[][]) => {
  const titlesOnly: string[][] = query.filter((q) => q[0] === 'title' && q.length === 2);
  if (!titlesOnly.length) {
    return []
  }
  return titlesOnly.map((q) => ({ title: { contains: q[1] } } ));
}

const createContentQuery = (query: string[][]) => {
  const contentsOnly: string[][] = query.filter((q) => q[0] === 'content' && q.length === 2);
  if (!contentsOnly.length) {
    return []
  }

  return contentsOnly.map((q) => ({ content: { contains: q[1] } } ));
}

const createPublishedQuery = (query: string[][]) => {
  const publishedOnly: string[][] = query.filter((q) => q[0] === 'published' && q.length === 2);
  if (!publishedOnly.length) {
    return []
  }

  return publishedOnly.map((q) => ({ published: q[1] === 'true' }))
}

const createAuthorQuery = (query: string[][]) => {
  const authorsOnly: string[][] = query.filter((q) => q[0] === 'author' && q.length === 2 && !isNumber(q[1]));
  if (!authorsOnly.length) {
    return []
  }

  return authorsOnly.map((q) => ({ authorId: Number(q[1]) }))
}

const createCreatedAtQuery = (query: string[][]) => {
  const createdAtOnly: string[][] = query.filter((q) => q[0] === 'createdAt' && q.length === 3);
  if (!createdAtOnly.length) {
    return []
  }

  return createdAtOnly.map((q) => {
    if (q[2] === 'lte') {
      return { createdAt: { lte: q[1] } }
    } else if (q[2] === 'gte') {
      return { createdAt: { gte: q[1] } }
    } else {
      return {}
    }
  })
}

const createUpdatedAtQuery = (query: string[][]) => {
  const updatedAtOnly: string[][] = query.filter((q) => q[0] === 'updatedAt' && q.length === 3);
  if (!updatedAtOnly.length) {
    return []
  }

  return updatedAtOnly.map((q) => {
    if (q[2] === 'lte') {
      return { updatedAt: { lte: q[1] } }
    } else if (q[2] === 'gte') {
      return { updatedAt: { gte: q[1] } }
    } else {
      return {}
    }
  })
}

const createAnyQuery = (query: string[][]) => {
  const anyOnly: string[][] = query.filter((q) => q[0] === 'any' && q.length === 2);
  if (!anyOnly.length) {
    return [];
  }

  return anyMapped = anyOnly
    .map((q) => {
      switch (q[0]) {
        case 'title': return createTitleQuery([['title', q[1]]]);
        case 'content': return createContentQuery([['content', q[1]]]);
        case 'published': return createPublishedQuery([['published', q[1]]]);
        case 'author': return createAuthorQuery([['author', q[1]]]);
        case 'tags': return { tags: createTagQuery([['tag', q[1]]])};
        default: return {}
      }
    })
    .flat(1);
}

const search = async (req: NextApiRequest, res: NextApiResponse) => {
  const method = req.method;
  if (method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  if (!req.body.query) {
    const data: SnippetType[] = await getSnippets();
    return res.status(200).json({
      query: [],
      count: data.length,
      data: data
    });
  } else if (! Array.isArray(req.body.query)) {
    return res.status(400).json({
      error: "Invalid search body. Expected type '[[\"tag\", \"python\"], [...], ...]'" }
    )
  }

  const query: string[][] = req.body.query;
  const totalData = await prisma.snippet.count();
  const data = await prisma.snippet.findMany({
    include: {
      author: { select: { id: true, username: true } },
      tags: { include: { tag: true } }
    },
    where: {
      AND: [
        { tags: createTagQuery(query) },
        ...createTitleQuery(query),
        ...createContentQuery(query),
        ...createPublishedQuery(query),
        ...createAuthorQuery(query),
        ...createCreatedAtQuery(query),
        ...createUpdatedAtQuery(query),
      ],
      OR: [...createAnyQuery(query)]
    }
  });

  return res.status(200).json({
    query: query,
    count: data.length,
    data: data.map((d) => {
      return {...d, tags: d.tags.map((t) => t.tag) }
    }),
    total: totalData
  });
};

export default search;
