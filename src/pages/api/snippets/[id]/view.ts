import {NextApiRequest, NextApiResponse} from "next";
import prisma from "@/lib/prisma";

const viewSnippet = async (req: NextApiRequest, res: NextApiResponse) => {
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
    const snippet = await prisma.snippet.update({
      where: { id: snippetId },
      data: {
        viewCount: { increment: 1 }
      }
    });
    return res.status(200).json({ viewCount: snippet.viewCount });
  } catch (err) {
    return res.status(404).json({ error: "Snippet not found", _error: err });
  }
}

export default viewSnippet;
