import {NextApiRequest, NextApiResponse} from "next";
import prisma from "@/lib/prisma";

const snippetInfo = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  const snippetCount = await prisma.snippet.count();
  const userCount: number = await prisma.user.count();
  const tagCount: number = await prisma.tag.count();

  return res.status(200).json({
    snippetCount: snippetCount,
    userCount: userCount,
    tagCount: tagCount
  });
}

export default snippetInfo;
