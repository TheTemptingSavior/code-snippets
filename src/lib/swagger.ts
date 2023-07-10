const readSwagger = () => {
  return {
    apiFolder: "pages/api",
    schemaFolders: ["lib"],
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Code Snippets API',
        version: '0.1',
        description: 'Hello, World!',
        license: {
          name: "Apache 2.0",
          url: "http://www.apache.org/licenses/LICENSE-2.0.html"
        },
      },
      servers: [
        { url: 'http://localhost:3000' }
      ],
      tags: [
        { name: "users", description: "User related actions" },
      ],
      components: {
        schemas: {
          ApiErrorResponse: {
            type: 'object',
            properties: {
              error: { type: 'string', example: 'Method Not Allowed' }
            }
          },
          User: {
            type: 'object',
            properties: {
              id: { type: 'integer', format: 'int32', example: '10' },
              username: { type: 'string', example: 'guest' },
              createdAt: { type: 'string', format: 'date-date', example: '2023-05-12T15:50:31Z' },
              updatedAt: { type: 'string', format: 'date-date', example: '2023-05-12T15:52:12Z' },
              lastLogin: { type: 'string', nullable: true, format: 'date-date', example: '2023-05-12T15:50:31Z' },
            }
          },
          UserRelation: {
            type: 'object',
            properties: {
              id: { type: 'integer', format: 'int32', example: '10' },
              username: { type: 'string', example: 'guest' },
            }
          },
          CreateUser: {
            type: 'object',
            properties: {
              username: { type: 'string', example: 'guest' },
              password: { type: 'string', example: 'super-secure-password' },
            }
          },
          UpdateUser: {
            type: 'object',
            properties: {
              username: { type: 'string', example: 'guest' },
              password: { type: 'string', example: 'super-secure-password' },
            }
          },
          Tag: {
            type: 'object',
            properties: {
              id: { type: 'integer', format: 'int32', example: '12' },
              name: { type: 'string', example: 'Work Related' },
              slug: { type: 'string', example: 'work-related' },
              uses: { type: 'integer', format: 'int32' },
            }
          },
          CreateTag: {
            type: 'object',
            properties: {
              name: { type: 'string', example: 'Work Related' },
            }
          },
          UpdateTag: {
            type: 'object',
            properties: {
              name: { type: 'string', example: 'Work Related' },
            }
          },
          Snippet: {
            type: 'object',
            properties: {
              id: { type: 'integer', format: 'int32', example: '10' },
              title: { type: 'string', example: 'Python3 Hello World' },
              content: { type: 'string', example: 'print("Hello, World!")' },
              published: { type: 'boolean', example: 'true' },
              createdAt: { type: 'string', format: 'date-date', example: '2023-05-12T15:50:31Z' },
              updatedAt: { type: 'string', format: 'date-date', example: '2023-05-12T15:50:31Z' },
              authorId: { type: 'integer', format: 'int32', example: '1' },
              author: { '$ref': '#/components/schemas/UserRelation' },
              tags: { type: 'array', items: { '$ref': '#/components/schemas/Tag' } }
            }
          },
          CreateSnippet: {
            type: 'object',
            properties: {
              title: { type: 'string', example: 'Python3 Hello World' },
              content: { type: 'string', example: 'print("Hello, World!")' },
              published: { type: 'boolean', example: 'true' },
              authorId: { type: 'integer', format: 'int32', example: '1' },
              tags: { type: 'array', items: { type: 'string', example: 'Hello World' } }
            }
          },
          UpdateSnippet: {
            type: 'object',
            properties: {
              title: { type: 'string', example: 'Python3 - Hello World', nullable: true },
              content: { type: 'string', example: 'print("Hello World!")', nullable: true },
              published: { type: 'boolean', example: 'true', nullable: true },
              tags: { type: 'array', items: { type: 'string', example: 'Hello World' }, nullable: true }
            }
          },
          SearchInput: {
            type: 'object',
            properties: {
              query: {
                type: 'array',
                items: {
                  type: 'array',
                  items: { type: 'string' }
                },
                example: '[["tag", "python"], ["title", "hello"]]'
              }
            }
          }
        }
      },
      paths: {
        '/api/users': {
          get: {
            summary: 'List users in the system',
            tags: ['users'],
            description: 'Get information on all the users registered in this application',
            operationId: 'getUsers',
            responses: {
              200: {
                description: 'List of user objects',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        count: { type: 'integer', format: 'int32', example: 10 },
                        data: { type: 'array', items: { '$ref': '#/components/schemas/User' } }
                      }
                    }
                  }
                }
              },
              405: {
                description: 'Method Not Allowed',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/ApiErrorResponse' } } }
              }
            }
          },
          post: {
            summary: 'Create a new user',
            tags: ['users'],
            operationId: 'createUser',
            requestBody: { content: { 'application/json': { schema: { '$ref': '#/components/schemas/CreateUser' } } } },
            responses: {
              201: {
                description: 'Create a new user',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/User' } } }
              },
              400: {
                description: 'Bad JSON body provided',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/ApiErrorResponse' } } }
              },
              409: {
                description: 'User already exists',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/ApiErrorResponse' } } }
              }
            }
          }
        },
        '/api/users/{id}': {
          get: {
            summary: 'Get a single user',
            tags: ['users'],
            operationId: 'getUser',
            parameters: [
              { name: 'id', description: 'ID of user to return', required: true, schema: { type: 'integer', format: 'int32', example: '10' }}
            ],
            responses: {
              200: {
                description: 'Information on the requested user',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/User' } } }
              },
              400: {
                description: 'Bad user ID provided',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/ApiErrorResponse' } } }
              },
              404: {
                description: 'User not found',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/ApiErrorResponse' } } }
              },
              405: {
                description: 'Method not allowed',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/ApiErrorResponse' } } }
              },
            }
          },
          delete: {
            summary: 'Delete a user',
            tags: ['users'],
            operationId: 'deleteUser',
            parameters: [
              { name: 'id', description: 'ID of user to delete', required: true, schema: { type: 'integer', format: 'int32', example: '10' }}
            ],
            responses: {
              200: {
                description: 'Deleted user object',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/User' } } }
              },
              400: {
                description: 'Bad user ID provided',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/ApiErrorResponse' } } }
              },
              404: {
                description: 'User not found',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/ApiErrorResponse' } } }
              },
              405: {
                description: 'Method not allowed',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/ApiErrorResponse' } } }
              },
            }
          },
          patch: {
            summary: 'Update a user',
            tags: ['users'],
            operationId: 'updateUser',
            parameters: [
              { name: 'id', description: 'ID of user to return', required: true, schema: { type: 'integer', format: 'int32', example: '10' }}
            ],
            requestBody: { content: { 'application/json': { schema: { '$ref': '#/components/schemas/UpdateUser' } } } },
            responses: {
              200: {
                description: 'Updated user object',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/User' } } }
              },
              400: {
                description: 'Bad JSON body provided',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/ApiErrorResponse' } } }
              },
              404: {
                description: 'User not found',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/ApiErrorResponse' } } }
              },
              405: {
                description: 'Method not allowed',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/ApiErrorResponse' } } }
              },
              409: {
                description: 'User already exists',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/ApiErrorResponse' } } }
              },
            }
          }
        },
        '/api/tags': {
          get: {
            summary: 'List tags in the system',
            tags: ['tags'],
            description: 'Get information on all the tags',
            operationId: 'getTags',
            responses: {
              200: {
                description: 'List of tag objects',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        count: {type: 'integer', format: 'int32', example: 10},
                        data: {type: 'array', items: {'$ref': '#/components/schemas/Tag'}}
                      }
                    }
                  }
                }
              },
              405: {
                description: 'Method Not Allowed',
                content: {'application/json': {schema: {'$ref': '#/components/schemas/ApiErrorResponse'}}}
              }
            }
          },
          post: {
            summary: 'Create a new tag',
            tags: ['tags'],
            operationId: 'createTag',
            requestBody: { content: { 'application/json': { schema: { '$ref': '#/components/schemas/CreateTag' } } } },
            responses: {
              201: {
                description: 'Create a new tag',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/Tag' } } }
              },
              400: {
                description: 'Bad JSON body provided',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/ApiErrorResponse' } } }
              },
              409: {
                description: 'User already exists',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/ApiErrorResponse' } } }
              }
            }
          }
        },
        '/api/tags/[id]': {
          get: {
            summary: 'Get a single tag',
            tags: ['tags'],
            operationId: 'getTag',
            parameters: [
              { name: 'id', description: 'ID of tag to return', required: true, schema: { type: 'integer', format: 'int32', example: '10' }}
            ],
            responses: {
              200: {
                description: 'Information on the requested tag',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/Tag' } } }
              },
              400: {
                description: 'Bad tag ID provided',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/ApiErrorResponse' } } }
              },
              404: {
                description: 'Tag not found',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/ApiErrorResponse' } } }
              },
              405: {
                description: 'Method not allowed',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/ApiErrorResponse' } } }
              },
            }
          },
          delete: {
            summary: 'Delete a tag',
            tags: ['tags'],
            operationId: 'deleteTag',
            parameters: [
              { name: 'id', description: 'ID of tag to delete', required: true, schema: { type: 'integer', format: 'int32', example: '10' }}
            ],
            responses: {
              200: {
                description: 'Deleted tag object',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/Tag' } } }
              },
              400: {
                description: 'Bad tag ID provided',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/ApiErrorResponse' } } }
              },
              404: {
                description: 'Tag not found',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/ApiErrorResponse' } } }
              },
              405: {
                description: 'Method not allowed',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/ApiErrorResponse' } } }
              },
            }
          },
          patch: {
            summary: 'Update a tag',
            tags: ['tags'],
            operationId: 'updateTag',
            parameters: [
              { name: 'id', description: 'ID of tag to return', required: true, schema: { type: 'integer', format: 'int32', example: '10' }}
            ],
            requestBody: { content: { 'application/json': { schema: { '$ref': '#/components/schemas/UpdateTag' } } } },
            responses: {
              200: {
                description: 'Updated tag object',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/Tag' } } }
              },
              400: {
                description: 'Bad JSON body provided',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/ApiErrorResponse' } } }
              },
              404: {
                description: 'Tag not found',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/ApiErrorResponse' } } }
              },
              405: {
                description: 'Method not allowed',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/ApiErrorResponse' } } }
              },
              409: {
                description: 'Tag already exists',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/ApiErrorResponse' } } }
              },
            }
          }
        },
        '/api/snippets': {
          get: {
            summary: 'List all snippets in the system',
            tags: ['snippets'],
            operationId: 'getSnippets',
            responses: {
              200: {
                description: 'List of snippet objects',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        count: {type: 'integer', format: 'int32', example: 10},
                        data: {type: 'array', items: {'$ref': '#/components/schemas/Snippet'}}
                      }
                    }
                  }
                }
              },
              405: {
                description: 'Method Not Allowed',
                content: {'application/json': {schema: {'$ref': '#/components/schemas/ApiErrorResponse'}}}
              }
            }
          },
          post: {
            summary: 'Create a new snippet',
            tags: ['snippets'],
            operationId: 'createSnippet',
            requestBody: { content: { 'application/json': { schema: { '$ref': '#/components/schemas/CreateSnippet' } } } },
            responses: {
              201: {
                description: 'Create a new snippet',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/Snippet' } } }
              },
              400: {
                description: 'Bad JSON body provided',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/ApiErrorResponse' } } }
              },
              409: {
                description: 'Snippet already exists',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/ApiErrorResponse' } } }
              }
            }
          }
        },
        '/api/snippets/[id]': {
          get: {
            summary: 'Get a single snippet',
            tags: ['snippets'],
            operationId: 'getSnippet',
            parameters: [
              { name: 'id', description: 'ID of snippet to return', required: true, schema: { type: 'integer', format: 'int32', example: '10' }}
            ],
            responses: {
              200: {
                description: 'Information on the requested snippet',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/Snippet' } } }
              },
              400: {
                description: 'Bad snippet ID provided',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/ApiErrorResponse' } } }
              },
              404: {
                description: 'Snippet not found',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/ApiErrorResponse' } } }
              },
              405: {
                description: 'Method not allowed',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/ApiErrorResponse' } } }
              },
            }
          },
          delete: {
            summary: 'Delete a snippet',
            tags: ['snippets'],
            operationId: 'deleteSnippet',
            parameters: [
              { name: 'id', description: 'ID of snippet to delete', required: true, schema: { type: 'integer', format: 'int32', example: '10' }}
            ],
            responses: {
              200: {
                description: 'Deleted tag object',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/Snippet' } } }
              },
              400: {
                description: 'Bad snippet ID provided',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/ApiErrorResponse' } } }
              },
              404: {
                description: 'Snippet not found',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/ApiErrorResponse' } } }
              },
              405: {
                description: 'Method not allowed',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/ApiErrorResponse' } } }
              },
            }
          },
          patch: {
            summary: 'Update a snippet',
            tags: ['snippets'],
            operationId: 'updateSnippet',
            parameters: [
              { name: 'id', description: 'ID of snippet to update', required: true, schema: { type: 'integer', format: 'int32', example: '10' }}
            ],
            requestBody: { content: { 'application/json': { schema: { '$ref': '#/components/schemas/UpdateSnippet' } } } },
            responses: {
              200: {
                description: 'Updated snippet object',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/Snippet' } } }
              },
              400: {
                description: 'Bad JSON body provided',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/ApiErrorResponse' } } }
              },
              404: {
                description: 'Snippet not found',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/ApiErrorResponse' } } }
              },
              405: {
                description: 'Method not allowed',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/ApiErrorResponse' } } }
              },
              409: {
                description: 'Snippet already exists',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/ApiErrorResponse' } } }
              },
            }
          }
        },
        '/api/snippets/[id]/pin': {
          post: {
            summary: 'Set a snippets pinned status',
            tags: ['snippets'],
            operationId: 'setSnippetPinned',
            parameters: [
              { name: 'id', description: 'ID of snippet to modify', required: true, schema: { type: 'integer', format: 'int32', example: '10' }}
            ],
            responses: {
              200: {
                description: 'Snippets pinned status',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      required: ['pinned'],
                      properties: {
                        pinned: {
                          type: 'boolean'
                        }
                      }
                    }
                  }
                }
              },
              400: {
                description: 'Bad snippet ID provided',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/ApiErrorResponse' } } }
              },
              404: {
                description: 'Snippet not found',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/ApiErrorResponse' } } }
              },
              405: {
                description: 'Method not allowed',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/ApiErrorResponse' } } }
              },
            }
          }
        },
        '/api/snippets/[id]/raw': {
          get: {
            summary: 'Get raw snippet content',
            tags: ['snippets'],
            operationId: 'getSnippetRaw',
            parameters: [
              {
                name: 'id',
                description: 'ID of snippet content to return',
                required: true,
                schema: {type: 'integer', format: 'int32', example: '10'}
              }
            ],
            responses: {
              200: {
                description: 'Information on the requested tag',
                content: {
                  'text/plain': {
                    description: 'Plain text of snippet content',
                    example: '#!/bin/bash\necho "Hello, World!"'
                  }
                },
                400: {
                  description: 'Bad snippet ID provided',
                  content: {'application/json': {schema: {'$ref': '#/components/schemas/ApiErrorResponse'}}}
                },
                404: {
                  description: 'Snippet not found',
                  content: {'application/json': {schema: {'$ref': '#/components/schemas/ApiErrorResponse'}}}
                },
                405: {
                  description: 'Method not allowed',
                  content: {'application/json': {schema: {'$ref': '#/components/schemas/ApiErrorResponse'}}}
                },
              }
            }
          },
        },
        '/api/snippets/[id]/visit': {
          get: {
            summary: 'Increment a snippets visited count',
            tags: ['snippets'],
            operationId: 'increaseSnippetViewCount',
            parameters: [
              {
                name: 'id',
                description: 'ID of snippet to visit',
                required: true,
                schema: {type: 'integer', format: 'int32', example: '10'}
              }
            ],
            responses: {
              200: {
                description: 'New snippet visit count',
                content: {
                  'application/json': {
                    type: 'object',
                    required: ['viewCount'],
                    properties: {
                      viewCount: {type: 'int', format: 'int32'},
                    }
                  }
                },
              },
              400: {
                description: 'Bad snippet ID provided',
                content: {'application/json': {schema: {'$ref': '#/components/schemas/ApiErrorResponse'}}}
              },
              404: {
                description: 'Snippet not found',
                content: {'application/json': {schema: {'$ref': '#/components/schemas/ApiErrorResponse'}}}
              },
              405: {
                description: 'Method not allowed',
                content: {'application/json': {schema: {'$ref': '#/components/schemas/ApiErrorResponse'}}}
              },
            }
          }
        },
        '/api/search': {
          post: {
            summary: 'Search snippets',
            tags: ['search'],
            operationId: 'search',
            requestBody: { content: { 'application/json': { schema: { '$ref': '#/components/schemas/SearchInput' } } } },
            responses: {
              200: {
                description: 'Snippets that match search terms',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        count: {type: 'integer', format: 'int32', example: 10},
                        total: {type: 'integer', format: 'int32', example: 12},
                        data: {type: 'array', items: {'$ref': '#/components/schemas/Snippet'}},
                        query: {
                          type: 'array',
                          items: {
                            type: 'array',
                            items: { type: 'string' }
                          },
                          example: '[["tag", "python"], ["title", "hello"]]'
                        }
                      }
                    }
                  }
                }
              },
              405: {
                description: 'Method not allowed',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/ApiErrorResponse' } } }
              },
            }
          }
        },
        '/api/info': {
          get: {
            summary: 'Information on users, snippets and tags',
            tags: ['info'],
            operationId: 'getInfo',
            responses: {
              200: {
                description: 'Information on the system',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        snippetCount: {type: 'integer', format: 'int32', example: 12},
                        userCount: {type: 'integer', format: 'int32', example: 12},
                        tagCount: {type: 'integer', format: 'int32', example: 12},
                      }
                    }
                  }
                }
              },
              405: {
                description: 'Method not allowed',
                content: { 'application/json': { schema: { '$ref': '#/components/schemas/ApiErrorResponse' } } }
              },
            }
          }
        }
      }
    },
  }
}

export default readSwagger;
