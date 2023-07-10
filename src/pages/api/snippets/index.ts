import {NextApiRequest, NextApiResponse} from "next";
import {createSnippet, CreateSnippet, getSnippets} from "@/lib/snippets";
import {Prisma, Snippet} from "@prisma/client";
import PrismaClientKnownRequestError = Prisma.PrismaClientKnownRequestError;

export interface CreateSnippetApiRequest extends NextApiRequest {
  body: CreateSnippet
}

const performGet = async (req: NextApiRequest, res: NextApiResponse) => {
  const data = await getSnippets();
  return res.status(200).json({
    count: data.length,
    data: data
  })
}

const performPost = async (req: CreateSnippetApiRequest, res: NextApiResponse) => {
  const data: CreateSnippet = req.body;
  try {
    const newSnippet: Snippet = await createSnippet(data);
    return res.status(201).json(newSnippet);
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      const statusCode = e.code === 'P2002' ? 409 : 400;
      return res.status(statusCode).json({
        error: "Snippet already exists",
        _error: (e as PrismaClientKnownRequestError).message
      });
    } else {
      return res.status(400).json({
        error: "Something went wrong creating the snippet",
        _error: (e as Object).toString()
      });
    }
  }
}

const snippets = async (req: NextApiRequest | CreateSnippetApiRequest, res: NextApiResponse) => {
  const { method } = req;

  switch (method) {
    case 'GET':
      return performGet(req, res);
    case 'POST':
      return performPost(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

export default snippets;
