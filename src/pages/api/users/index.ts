import {NextApiResponse, NextApiRequest} from 'next'
import {UserType, getUsers, CreateUserType, createUser} from '@/lib/users'
import {Prisma, User} from ".prisma/client";
import PrismaClientKnownRequestError = Prisma.PrismaClientKnownRequestError;


export interface CreateUserApiRequest extends NextApiRequest {
  body: CreateUserType
}

const performGet = async (req: CreateUserApiRequest, res: NextApiResponse) => {
  const data: UserType[] = await getUsers();
  return res.status(200).json({
    count: data.length,
    data: data
  });
}

const performPost = async (req: CreateUserApiRequest, res: NextApiResponse) => {
  const userData: CreateUserType = { ...req.body };
  try {
    const newUser: User = await createUser(userData);
    return res.status(201).json(newUser);
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      const statusCode = e.code === 'P2002' ? 409 : 400;
      return res.status(statusCode).json({
        error: "User with this username already exists",
        _error: (e as PrismaClientKnownRequestError).message
      });
    } else {
      return res.status(400).json({
        error: "Something went wrong creating the user"
      });
    }
  }
}

const users = async (req: NextApiRequest | CreateUserApiRequest, res: NextApiResponse) => {
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

export default users;
