import {NextApiRequest, NextApiResponse} from "next";
import {deleteTag, getTag, updateTag, UpdateTagType} from "@/lib/tags";
import {Prisma, Tag} from ".prisma/client";
import PrismaClientKnownRequestError = Prisma.PrismaClientKnownRequestError;

export interface UpdateTagApiRequest extends NextApiRequest {
  body: UpdateTagType
}

const performGet = async (req: NextApiRequest, res: NextApiResponse) => {
  const tagId: number = Number(req.query.id);

  try {
    const data: Tag = await getTag(tagId);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(404).json({ error: "Tag not found", _error: err });
  }
}

const performDelete = async (req: NextApiRequest, res: NextApiResponse) => {
  const tagId: number = Number(req.query.id);

  try {
    const deletedTag: Tag = await deleteTag(tagId);
    return res.status(200).json(deletedTag);
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      return res.status(500).json({ "error": "Something went wrong deleting the tag", "_error": e.message });
    } else {
      return res.status(500).json({ "error": "Something went wrong deleting the tag" });
    }
  }
}

const performPatch = async (req: UpdateTagApiRequest, res: NextApiResponse) => {
  const tagId: number = Number(req.query.id);

  try {
    const updatedTag: Tag = await updateTag(tagId, req.body);
    return res.status(200).json(updatedTag);
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        return res.status(409).json({ "error": "A tag with this name/slug already exists." });
      }
      return res.status(500).json({ "error": "Something went wrong updating the tag", "_error": e.message });
    } else {
      return res.status(500).json({ "error": "Something went wrong deleting the tag" });
    }
  }
}

const tag = async (req: NextApiRequest | UpdateTagApiRequest, res: NextApiResponse) => {
  const { method } = req;
  const tagId: number = Number(req.query.id);

  if (isNaN(tagId)) {
    return res.status(400).json({ error: "Invalid tag ID" });
  }

  switch (method) {
    case 'GET':
      return performGet(req, res);
    case 'DELETE':
      return performDelete(req, res);
    case 'PATCH':
      return performPatch(req, res);
    default:
      res.setHeader('Allow', ['GET', 'DELETE', 'PATCH']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

export default tag;
