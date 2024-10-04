# OpenAPI-TSK 🚀

OpenAPI-tsk tool is one part of the `NodeTskeleton` template project to install, to initialize and to interact with it.

`NodeTskeleton` is a `Clean Architecture` based `template project` for `NodeJs` using `TypeScript` to implement with any `web server framework` or even any user interface.

<a href="https://github.com/harvic3/nodetskeleton" target="_blank" >Go to NodeTskeleton</a>


## Using OpenAPI-TSK

The API documentation can already be generated automatically through a strategy in the method where the routes are configured using Open API.

You can see the API documentation in NodeTSKeleton project going to the next url once you have setup your local project:
```text
localhost:3003/api/docs
```
But first, you have to setup the project, so if you want, you can do it very fast executing this command on your computer:
- Run it using NPX and replace `my-awesome-project` for your own project name
```console
npx run-tsk setup project-name=my-awesome-project
```

> The API documentation is done in the initializeRoutes method of each controller as shown below:

```ts
  initializeRoutes(router: IRouter): void {
    this.setRouter(router());
    this.addRoute({
      method: HttpMethodEnum.GET,
      path: "/v1/feelings",
      handlers: [this.getFeelingText],
      produces: [
        {
          applicationStatus: ApplicationStatus.SUCCESS,
          httpStatus: HttpStatusEnum.SUCCESS,
        },
        {
          applicationStatus: ApplicationStatus.USER_NOT_FOUND,
          httpStatus: HttpStatusEnum.NOT_FOUND,
        },
      ],
    });
  }
```

Then once you have added your route, the same method is used to configure a property called apiDoc, and in this one you can have the following ways to configure your data models (Request, Response, Parameters) through the following Descriptor Objects:

```ts
// To describe a ResultT type (ResultTDescriber and TypeDescriber helps us to do it)
apiDoc: {
  contentType: HttpContentTypeEnum.APPLICATION_JSON,
  requireAuth: false,
  schema: new ResultTDescriber<TokenDto>({
    name: TokenDto.name,
    type: PropTypeEnum.OBJECT,
    props: {
      data: new TypeDescriber<TokenDto>({
        name: TokenDto.name,
        type: PropTypeEnum.OBJECT,
        // Option one to describe a scheme response type
        props: {
          token: {
            type: PropTypeEnum.STRING,
          },
          expiresIn: {
            type: PropTypeEnum.NUMBER,
          },
          { ... }
        },
        // Option two to describe a scheme response type
        props: TypeDescriber.describeProps<TokenDtoType>({
          token: PropTypeEnum.STRING,
          expiresIn: PropTypeEnum.NUMBER,
          owner: TypeDescriber.describeReference<OwnerType>(OwnerDto.name, {
            email: PropTypeEnum.STRING,
            sessionId: PropTypeEnum.STRING,
          }),
        }),
      }),
      ...ResultDescriber.default(),
    },
  }),
},

// Observation about ApiDocs TokenDto class for way two to describe a model as example
// Token classes
export type OwnerType = {
  email: string;
  sessionId: string;
};

export class OwnerDto implements OwnerType {
  email: string;
  sessionId: string;

  constructor(props: OwnerType) {
    this.email = props.email;
    this.sessionId = props.sessionId;
  }
}

export type TokenDtoType = {
  token: string;
  expiresIn: number;
  owner: OwnerDto;
};

export class TokenDto implements TokenDtoType {
  token: string;
  expiresIn: number;
  owner: OwnerDto;

  constructor(props: TokenDtoType) {
    this.token = props.token;
    this.expiresIn = props.expiresIn;
    this.owner = props.owner;
  }
}

// To describe a simple Result type (ResultDescriber helps us to do it)
apiDoc: {
  contentType: HttpContentTypeEnum.APPLICATION_JSON,
  requireAuth: false,
  schema: new ResultDescriber({
    type: PropTypeEnum.OBJECT,
    props: { ...ResultDescriber.default() },
  }),
},

// To describe any object (TypeDescriber helps us to do it)
apiDoc: {
  contentType: HttpContentTypeEnum.TEXT_PLAIN,
  requireAuth: false,
  schema: new TypeDescriber<string>({
    name: PropTypeEnum.STRING,
    type: PropTypeEnum.PRIMITIVE,
    props: {
      primitive: PropTypeEnum.STRING,
    },
  }),
},
```

To get an overall idea, here an example:

```ts
  initializeRoutes(router: IRouter): void {
    this.setRouter(router());
    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/v1/auth/login",
      handlers: [this.login],
      produces: [
        {
          applicationStatus: ApplicationStatus.SUCCESS,
          httpStatus: HttpStatusEnum.SUCCESS,
        },
        {
          applicationStatus: ApplicationStatus.UNAUTHORIZED,
          httpStatus: HttpStatusEnum.UNAUTHORIZED,
        },
      ],
      description: "Login user",
      apiDoc: {
        contentType: HttpContentTypeEnum.APPLICATION_JSON,
        requireAuth: false,
        schema: new ResultTDescriber<TokenDto>({
          name: TokenDto.name,
          type: PropTypeEnum.OBJECT,
          props: {
            data: new TypeDescriber<TokenDto>({
              name: TokenDto.name,
              type: PropTypeEnum.OBJECT,
              props: TypeDescriber.describeProps<TokenDto>({
                token: PropTypeEnum.STRING,
                expiresIn: PropTypeEnum.NUMBER,
                // This added section is only a demo to show how to use nested objects in the response
                owner: TypeDescriber.describeReference<OwnerDto>(OwnerDto.name, {
                  email: PropTypeEnum.STRING,
                  sessionId: PropTypeEnum.STRING,
                }),
              }),
            }),
            ...ResultDescriber.default(),
          },
        }),
        requestBody: {
          description: "Credentials for login",
          contentType: HttpContentTypeEnum.APPLICATION_JSON,
          schema: new TypeDescriber<ICredentials>({
            name: "Credentials",
            type: PropTypeEnum.OBJECT,
            props: TypeDescriber.describeProps<ICredentials>({
              email: PropTypeEnum.STRING,
              passwordB64: {
                type: PropTypeEnum.STRING,
                format: PropFormatEnum.BASE64,
              },
            }),
          }),
        },
      },
    });
  }
```

Yes, I know what you're thinking, but no, I thought of that too. 
When you have already registered (described) a model, it is not necessary to describe it again, simply use the `RefTypeDescriber` class and with this the system will simply map internally the reference to the described model if it exists, otherwise, you will have an error in the generated file when it is going to be rendered. 

```ts
  this.addRoute({
    method: HttpMethodEnum.GET,
    path: "/v1/users/:userId",
    handlers: [this.get],
    produces: [
      {
        applicationStatus: ApplicationStatus.INVALID_INPUT,
        httpStatus: HttpStatusEnum.BAD_REQUEST,
      },
      {
        applicationStatus: ApplicationStatus.SUCCESS,
        httpStatus: HttpStatusEnum.SUCCESS,
      },
      {
        applicationStatus: ApplicationStatus.UNAUTHORIZED,
        httpStatus: HttpStatusEnum.UNAUTHORIZED,
      },
    ],
    description: "Get a user",
    apiDoc: {
      contentType: HttpContentTypeEnum.APPLICATION_JSON,
      requireAuth: true,
      schema: new RefTypeDescriber({
        type: PropTypeEnum.OBJECT,
        name: Result.name,
      }),
      parameters: [
        {
          name: "userId",
          in: ParameterIn.PATH,
          description: "User id",
          required: true,
          deprecated: false,
          allowEmptyValue: false,
        },
      ],
    },
  });
```

Once you run the application in DEV mode then the system will generate the file corresponding to the configuration you injected in the API. 
The file is created in the root of the project with the name `openapi.json` and it would look something like this:

```json
{
  "openapi": "3.0.3",
  "info": {
    "title": "NodeTSkeleton API",
    "version": "1.0.0",
    "description": "Api documentation for NodeTSkeleton project",
    "contact": {
      "name": "TSK Support",
      "url": "https://github.com/harvic3/nodetskeleton",
      "email": "harvic3@protonmail.com"
    },
    "license": {
      "name": "BSD 3-Clause"
    }
  },
  "servers": [
    {
      "url": "http://localhost:3003/api",
      "description": "Local server"
    }
  ],
  "paths": {
    "/v1/auth/logout": {
      "delete": {
        "description": "Logout user",
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ResultTClosedSession"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ResultTClosedSession"
                }
              }
            }
          }
        },
        "security": [
          {
            "bearerAuth": []
          }
        ]
      }
    },
    "/v1/auth/login": {
      "post": {
        "description": "Login user",
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ResultTTokenDto"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ResultTTokenDto"
                }
              }
            }
          }
        },
        "requestBody": {
          "description": "Credentials for login",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/Credentials"
              }
            }
          }
        }
      }
    },
    "/status": {
      "get": {
        "description": "API status endpoint",
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "text/plain": {
                "schema": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "/v1/users/sign-up": {
      "post": {
        "description": "Register a new user",
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Result"
                }
              }
            }
          },
          "400": {
            "description": "Bad Request",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Result"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Result"
                }
              }
            }
          }
        },
        "requestBody": {
          "description": "User data",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UserDto"
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "Object": {
        "type": "object",
        "properties": {
          "closed": {
            "type": "boolean"
          }
        }
      },
      "ResultTClosedSession": {
        "type": "object",
        "properties": {
          "message": {
            "type": "string"
          },
          "statusCode": {
            "type": "string"
          },
          "error": {
            "type": "string"
          },
          "success": {
            "type": "boolean"
          },
          "data": {
            "$ref": "#/components/schemas/Object"
          }
        }
      },
      "TokenDto": {
        "type": "object",
        "properties": {
          "token": {
            "type": "string"
          },
          "expiresIn": {
            "type": "number"
          },
          "owner": {
            "$ref": "#/components/schemas/Owner"
          }
        }
      },
      "Owner": {
        "type": "object",
        "properties": {
          "email": {
            "type": "string"
          },
          "sessionId": {
            "type": "string"
          }
        }
      },
      "ResultTTokenDto": {
        "type": "object",
        "properties": {
          "message": {
            "type": "string"
          },
          "statusCode": {
            "type": "string"
          },
          "error": {
            "type": "string"
          },
          "success": {
            "type": "boolean"
          },
          "data": {
            "$ref": "#/components/schemas/TokenDto"
          }
        }
      },
      "Credentials": {
        "type": "object",
        "properties": {
          "email": {
            "type": "string"
          },
          "passwordB64": {
            "type": "string"
          }
        },
        "required": [
          "email",
          "passwordB64"
        ]
      },
      "Result": {
        "type": "object",
        "properties": {
          "message": {
            "type": "string"
          },
          "statusCode": {
            "type": "string"
          },
          "error": {
            "type": "string"
          },
          "success": {
            "type": "boolean"
          }
        }
      },
      "UserDto": {
        "type": "object",
        "properties": {
          "firstName": {
            "type": "string"
          },
          "lastName": {
            "type": "string"
          },
          "gender": {
            "type": "string"
          },
          "email": {
            "type": "string"
          },
          "passwordB64": {
            "type": "string"
          }
        }
      }
    },
    "securitySchemes": {
      "bearerAuth": {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "bearer"
      }
    }
  }
}
```

You can explore and follow the instructions in the official documentation about NodeTSKeleton
<a href="https://github.com/harvic3/nodetskeleton?tab=readme-ov-file#create-your-first-use-case" target="_blank" >Go to NodeTskeleton</a>

## Warning 💀

> Use this resource at your own risk.
