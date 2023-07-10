import {NextApiResponse, NextApiRequest} from 'next'
import {UserType, getUser, deleteUser, UpdateUserType, updateUser} from '@/lib/users'
import {Prisma, User} from ".prisma/client";
import PrismaClientKnownRequestError = Prisma.PrismaClientKnownRequestError;

interface UpdateUserApiRequest extends NextApiRequest {
  body: UpdateUserType
}

const performGet = async (req: NextApiRequest, res: NextApiResponse) => {
  const userId = Number(req.query.id);
  try {
    const data: UserType = await getUser(userId);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(404).json({ error: "User not found", _error: err });
  }
}

const performDelete = async (req: NextApiRequest, res: NextApiResponse) => {
  const userId = Number(req.query.id);
  try {
    const deletedUser: User = await deleteUser(userId);
    return res.status(200).json(deletedUser);
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      return res.status(500).json({ "error": "Something went wrong deleting the user", "_error": e.message });
    } else {
      return res.status(500).json({ "error": "Something went wrong deleting the user" });
    }
  }
}

const performPatch = async (req: UpdateUserApiRequest, res: NextApiResponse) => {
  const userId = Number(req.query.id);
  try {
    const updatedUser: User = await updateUser(userId, req.body);
    return res.status(200).json(updatedUser);
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        return res.status(409).json({ "error": "A user with this username already exists." });
      }
      return res.status(500).json({ "error": "Something went wrong updating the user", "_error": e.message });
    } else {
      return res.status(500).json({ "error": "Something went wrong updating the user" });
    }
  }
};

const users = async (req: NextApiRequest | UpdateUserApiRequest, res: NextApiResponse) => {
  const { method } = req;
  const userId: number = Number(req.query.id);

  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  switch (method) {
    case 'GET':
      return performGet(req, res)
    case 'DELETE':
      return performDelete(req, res);
    case 'PATCH':
      return performPatch(req, res);
    default:
      res.setHeader('Allow', ['GET', 'DELETE', 'PATCH']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}


export default users;
