import {NextApiRequest, NextApiResponse} from "next";
import {getSnippet} from "@/lib/snippets";

const rawSnippet = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  if (method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).end(`Method ${method} Not Allowed`);
  }
  const snippetId: number = Number(req.query.id);
  if (isNaN(snippetId)) {
    return res.status(400).json({error: "Invalid snippet ID"});
  }

  try {
    const snippetData = await getSnippet(snippetId);
    res.setHeader('Content-Type', 'plain/text');
    return res.status(200).send(snippetData.content);
  } catch (err) {
    return res.status(404).json({ error: "Snippet not found", _error: err });
  }
}

export default rawSnippet;
