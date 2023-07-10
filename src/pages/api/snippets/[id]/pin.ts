import {NextApiRequest, NextApiResponse} from "next";
import {getSnippet} from "@/lib/snippets";
import prisma from "@/lib/prisma";

const pinSnippet = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  if (method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  const snippetId: number = Number(req.query.id);
  if (isNaN(snippetId)) {
    return res.status(400).json({error: "Invalid snippet ID"});
  }

  if (!req.body.hasOwnProperty('pinned')) {
    return res.status(400).json({error: "Missing required body property 'pinned'"});
  }
  const pinStatus: boolean = Boolean(req.body.pinned);

  try {
    const snippetData = await getSnippet(snippetId);
    await prisma.snippet.update({
      where: { id: snippetData.id },
      data: {
        pinned: pinStatus
      }
    });
    return res.status(200).json({ pinned: pinStatus });
  } catch (err) {
    return res.status(404).json({ error: "Snippet not found", _error: err });
  }
}

export default pinSnippet;
