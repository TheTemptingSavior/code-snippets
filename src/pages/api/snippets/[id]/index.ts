import {NextApiRequest, NextApiResponse} from "next";
import {deleteSnippet, getSnippet, UpdateSnippet, updateSnippet} from "@/lib/snippets";
import {Prisma} from ".prisma/client";
import PrismaClientKnownRequestError = Prisma.PrismaClientKnownRequestError;


interface UpdateSnippetApiRequest extends NextApiRequest {
  body: UpdateSnippet
}

const performGet = async (req: NextApiRequest, res: NextApiResponse) => {
  const snippetId: number = Number(req.query.id);

  try {
    const data = await getSnippet(snippetId);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(404).json({ error: "Snippet not found", _error: err });
  }
}

const performDelete = async (req: NextApiRequest, res: NextApiResponse) => {
  const snippetId: number = Number(req.query.id);

  try {
    const deletedSnippet = await deleteSnippet(snippetId);
    return res.status(200).json(deletedSnippet);
  } catch (err) {
    return res.status(404).json({ error: "Snippet not found", _error: err });
  }
}

const performPatch = async (req: UpdateSnippetApiRequest, res: NextApiResponse) => {
  const snippetId: number = Number(req.query.id);
  try {
    const updatedSnippet = await updateSnippet(snippetId, req.body);
    return res.status(200).json(updatedSnippet);
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        return res.status(409).json({ "error": "A snippet with this title already exists." });
      }
      return res.status(500).json({ "error": "Something went wrong updating the snippet", "_error": e.message });
    } else {
      return res.status(500).json({ "error": "Something went wrong updating the user" });
    }
  }
}

const snippet = async (req: NextApiRequest | UpdateSnippetApiRequest, res: NextApiResponse) => {
  const {method} = req;
  const snippetId: number = Number(req.query.id);

  if (isNaN(snippetId)) {
    return res.status(400).json({error: "Invalid snippet ID"});
  }

  switch (method) {
    case 'GET':
      return performGet(req, res);
    case 'DELETE':
      return performDelete(req, res);
    case 'PATCH':
      return performPatch(req, res);
    default:
      res.setHeader('Allow', ['GET', 'PATCH', 'DELETE'])
      return res.status(405).end(`Method ${method} Not Allowed`);
  }

}


export default snippet;
