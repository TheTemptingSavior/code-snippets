import {NextApiRequest, NextApiResponse} from "next";
import {createTag, CreateTagType, getTags, TagType} from "@/lib/tags";
import {Prisma, Tag} from ".prisma/client";
import PrismaClientKnownRequestError = Prisma.PrismaClientKnownRequestError;

export interface CreateTagApiRequest extends NextApiRequest {
  body: CreateTagType
}

const performGet = async (req: NextApiRequest, res: NextApiResponse) => {
  const data: TagType[] = await getTags();
  return res.status(200).json({
    count: data.length,
    data: data
  });
}

const performPost = async (req: CreateTagApiRequest, res: NextApiResponse) => {
  const tagData: CreateTagType = { ...req.body };
  try {
    const newTag: Tag = await createTag(tagData);
    return res.status(201).json(newTag);
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      const statusCode = e.code === 'P2002' ? 409 : 400;
      return res.status(statusCode).json({
        error: "Tag already exists",
        _error: (e as PrismaClientKnownRequestError).message
      });
    } else {
      return res.status(400).json({
        error: "Something went wrong creating the tag"
      });
    }
  }
}

const tags = async (req: NextApiRequest, res: NextApiResponse) => {
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

export default tags;
