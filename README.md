**Setup**
---

**Commands**
---

- npm run dev - run development mode
- npm run tests - run all tests
- npm run test PATH - run one tests
- npm run jobs - run send recipients by schedule (check every 10 minutes, logs - logs/job.log)

# API
  - about api v2 you can read with swagger
  - about api v3 you can read with grapihql by path /api/v3

# Development without docker
  - start redis-server
  - run npm install
  - cp ./config/variables.env.sample ./config/variables.env
  - run mongodb
  - npm run dev

# Docker

### development
  - docker-compose build
  - docker-compose up

  after you can add for fake data
  - docker-compose run app npm run db:seed

  run tests
  - docker-compose run app npm run tests

  app http://localhost:8080
  swagger http://localhost:8081
  dynamodb http://localhost:8000
  dynamodbtest http://localhost:8001

# Seed data in dynamo db

### local

  - run dynamo db local (you can use docker)

  - set env
    DYNAMO_LOCAL_URL=http://localhost:8000
    USE_DYNAMO_REMOTE=false

  - run "npm run db:seed"


### aws

  - set env
    AWS_ACCESS_KEY_ID=AWS_ACCESS_KEY_ID
    AWS_SECRET_ACCESS_KEY=AWS_SECRET_ACCESS_KEY
    AWS_REGION=AWS_REGION
    USE_DYNAMO_REMOTE=true

  - run "npm run db:seed"

  - users
  ````text
    root@test.com - role root
    user1@test.com - role admin
    user2@test.com - role guest
    passwords - 12345
  ````

### ports
- app: http://localhost:8080
- swagger: http://localhost:8081

# How use Swagger

#### docker
  - npm run dev
  - docker run -p 3000:8080 -e API_URL=http://localhost:8080/swagger swaggerapi/swagger-ui
  - open http://localhost:3000

#### online editor
 - copy swagger.yaml
 - insert https://editor.swagger.io/

 or

  - npm i -g swagger
  - swagger project edit

  or

  - docker-compose up
  - open http://localhost:8081


**Deployment**
---

### Environment Variables (config/variables.env.${environment})
- Add SSM keys
  - NODE_ENV
  - JWT_SECRET
  - DYNAMO_LOCAL_URL (if need use local)
  - USE_DYNAMO_REMOTE (set true if you use remove dynamo db)

  - COOKIE_NAME
  - COOKIE_DOMAIN

  - AWS_ACCESS_KEY_ID
  - AWS_SECRET_ACCESS_KEY
  - AWS_REGION

  - EMAIL_FROM
  - URI_FRONTEND
  - UNSUBSCRIBE_URI_FRONTEND

  - SOCKET_ORIGINS

  - USE_AMAZON_SERVERLESS (if you use aws lamda on cloud)

### AWS CodeBuild, CodeDeploy, CodePipeline
  - Configure instance IAM with SES, CodeDeploy, S3, Cloudwatch, AutoScaling, EC2
  - Configure EC2 instances with CodeDeploy Agent


<!-- # Socket
  - for authentication can use query token jwt or cookie
  - connect by socket with namespace (you can find GET /me field namespace)
  - create event POST /events
  - for this event will send socket.emit
  - example frontend:

  ```javascript
    import io from 'socket.io-client'

    const client = io(`http://127.0.0.1:8080/urn:ipreplay:${company or user id}`, {
      path: "/socket.io",

      // you can use for tests
      query: {
        token: jwt,
      },
    })
  ``` -->

# Serverless

### deploy lamda and appsync
  - npm i -g serverless
  - serverless config credentials --provider aws --key KEY --secret SECRET
  - cp ./config/variables.env.aws.lamda.sample ./config/variables.env.aws.lamda
  - fill ACCOUNT_ID
  - npm run sls:deploy
  - add in variables.env.aws.lamda env APP_SYNC_API_ID and APP_SYNC_API_KEY

### update lamda and appsync
  - npm run sls:update

### graphql subscribe
  - subscribes have only mutations (appsync restrictions)
  - aws lamda write errors in log, but subscribe not send it (appsync restrictions)

  - example frontend

  ```javascript
    subscription subscribeToLogCompany($namespace: String!) {
      subscribeToLogCompany(namespace: $namespace) {
        company {
          id
        }
        relay
        namespace
      }
    }
  ```

### example init appsync on client with jwt token

  ```javascript
    import AWSAppSyncClient from "aws-appsync"
    import { setContext } from "apollo-link-context"

    const authLink = setContext((_, { headers }) => {
      return {
        headers: {
          ...headers,
          authorization: TOKEN,
        }
      }
    })

    const client = new AWSAppSyncClient({
      url: URL,
      region: REGION,
      auth: {
        type: "API_KEY",
        apiKey: API_KEY,
      },
    })

    client.link = authLink.concat(client.link)

    export client
  ```

### details

- AppSync does not support scalar types, because need use json as string
  use JSON.stringify({ "payload": "payload" }}
  for mutation createPixels attribute payload

### How use aws lamda with graphql?
  need to add header "request-type": "graphql"
  after you can get header Set-Cookie,
  and run graphql query, mutations without appsync

