import {PrismaClient, Prisma, Snippet} from '@prisma/client'
import {User} from ".prisma/client";
import {makeSlug} from "../src/lib/utils";

const prisma = new PrismaClient()

export const userData: {id: number, username: string, password: string}[] = [
  { id: 1, username: 'ethan', password: 'cotterell' },
  { id: 2, username: 'guest', password: 'guest' }
];

export const snippetData: Prisma.SnippetCreateInput[] = [
  {
    title: 'PostgreSQL Database Size',
    slug: makeSlug('PostgreSQL Database Size'),
    description: 'Print out the sizes of databases on a PostgreSQL server',
    content: 'SELECT t1.datname AS db_name, pg_size_pretty(pg_database_size(t1.datname)) as db_size\nFROM pg_database t1\nORDER BY pg_database_size(t1.datname) DESC',
    language: 'sql',
    published: true,
    viewCount: 10,
    author: {
      connect: { id: 1 }
    },
    tags: {
      create: [
        { tag: { connectOrCreate: { where: { slug: 'sql' }, create: { name: 'SQL', slug: 'sql' } } } },
        { tag: { connectOrCreate: { where: { slug: 'postgresql' }, create: { name: 'PostgreSQL', slug: 'postgresql' } } } },
        { tag: { connectOrCreate: { where: { slug: 'database' }, create: { name: 'Database', slug: 'database' } } } },
      ]
    }
  },
  {
    title: 'Python3 SysLog Server',
    slug: makeSlug('Python3 SysLog Server'),
    description: 'Create a syslog server that echoes all messages received to stdout.',
    language: 'python',
    content: 'import logging\nimport socketserver\n\nLOG_FILE = "youlogfile.log"\nHOST, PORT = "0.0.0.0", 514\n\n# logging.basicConfig(level=logging.INFO, format="%(message)s", datefmt="", filename=LOG_FILE, filemode="a")\n\nclass SyslogUDPHandler(socketserver.BaseRequestHandler):\n    def handle(self):\n        data = bytes.decode(self.request[0].strip())\n        socket = self.request[1]\n        print( "%s : " % self.client_address[0], str(data))\n#		logging.info(str(data))\n\nif __name__ == "__main__":\n    try:\n        server = socketserver.UDPServer((HOST,PORT), SyslogUDPHandler)\n        server.serve_forever(poll_interval=0.5)\n    except (IOError, SystemExit):\n        raise\n    except KeyboardInterrupt:\n        print ("Crtl+C Pressed. Shutting down.")',
    published: true,
    viewCount: 7,
    author: { connect: { id: 2 } },
    tags: {
      create: [
        { tag: { connectOrCreate: { where: { slug: 'python' }, create: { name: 'Python', slug: 'python' } } } },
        { tag: { connectOrCreate: { where: { slug: 'syslog' }, create: { name: 'SYSLog', slug: 'syslog' } } } },
      ]
    }
  },
  {
    title: 'Apache Environment Vairable \`mod_wsgi\`',
    slug: makeSlug('Apache Environment Vairable \`mod_wsgi\`'),
    description: 'Add \`apache2.conf\` environment variables to a \`mod_wsgi\` application',
    language: 'python',
    content: `# File: apache2.conf
##
## # Line in file
## SetEnv APP_ENV_VAR helloworld
##

# File: pyramid.wsgi
import os
import sys

from pyramid.paster import get_app, setup_logging


# Determine where we are. If we are in the deployment folder then we want to ensure that we get the production INI file
path = os.path.dirname(__file__)
if "deployment" in path.lower():
    ini_path = os.path.join(path, "prod.ini")
else:
    ini_path = os.path.join(path, "dev.ini")

# Ensure our current folder is part of the path
if path not in sys.path:
    sys.path.append(path)

# Setup the Pyramid logging system
setup_logging(ini_path)

def application(req_environ, start_response):
    """
    Create a wrapper application wrapper around our main Pyramid application. This allows us to intercept the request
    environment and add the Apache2 environment variables to this request. The goal here is to pass along database
    credentials, keys and passwords to the app from the protected \`apache2.conf\` file.
    """
    _env = {k: v for k, v in req_environ.items() if k.startswith("APP")}
    os.environ.update(_env)
    _application = get_app(ini_path, "main")
    return _application(req_environ, start_response)`,
    viewCount: 0,
    published: true,
    author: { connect: { id: 2 } },
    tags: {
      create: [
        { tag: { connectOrCreate: { where: { slug: 'apache' }, create: { name: 'Apache', slug: 'apache' } } } },
        { tag: { connectOrCreate: { where: { slug: 'python' }, create: { name: 'Python', slug: 'python' } } } },
        { tag: { connectOrCreate: { where: { slug: 'mod-wsgi' }, create: { name: 'mod_wsgi', slug: 'mod-wsgi' } } } },
      ]
    }
  },
  {
    title: 'Edit a Previous Commit',
    slug: makeSlug('Edit a Previous Commit'),
    description: 'Go back in git history to modify a commit without changing the history completely',
    language: 'bash',
    published: true,
    viewCount: 0,
    content: '# assuming the offending commit hash is "bbc643cd"\n' +
      'git rebase --interactive "bbc643cd^"\n' +
      '# edit the required files here\n' +
      'git commit --all --amend --no-edit\n' +
      'git rebase --continue\n' +
      '# force push now as the history as changed',
    tags: {
      create: [
        { tag: { connectOrCreate: { where: { slug: 'git' }, create: { name: 'Git', slug: 'git' } } } },
        { tag: { connectOrCreate: { where: { slug: 'bash' }, create: { name: 'bash', slug: 'bash' } } } },
      ]
    }
  }
]


async function main() {
  console.log(`Start seeding ...`)
  for (const u of userData) {
    const user: User = await prisma.user.create({
      data: u
    });
    console.log(`Created user with id: ${user.id}`)
  }
  for (const s of snippetData) {
    const snippet: Snippet = await prisma.snippet.create({
      data: s,
    });
    console.log(`Created snippet with id: ${snippet.id}`);
  }

  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
