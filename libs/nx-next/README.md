# nx-next

An Nx plugin for Next.js applications.

## Installation

```shell
npm install --save @yolkai/nx-next
# or
yarn add @yolkai/nx-next
# or
pnpm add @yolkai/nx-next
```

## Usage

### `workspace.json`:

```json
{
  "version": 1,
  "projects": {
    "my-project": {
      "architect": {
        "build": {
          "builder": "@yolkai/nx-next:build",
          "options": {
            "root": "apps/my-project",
            "outputPath": "dist/apps/my-project"
          }
        },
        "customServer": {
          "builder": "@nrwl/node:build",
          "options": {
            "outputPath": "dist/apps/my-project/.server",
            "main": "apps/my-project/server/index.ts",
            "tsConfig": "apps/my-project/server/tsconfig.json",
            "assets": []
          }
        },
        "serve": {
          "builder": "@yolkai/nx-next:serve",
          "options": {
            "buildTarget": "my-project:build",
            "customServerTarget": "my-project:customServer",
            "port": 3007
          },
          "configurations": {
            "dev": {
              "dev": true,
              "skipBuild": false
            },
            "production": {
              "dev": false,
              "skipBuild": true
            },
            "coverage": {
              "dev": false
            }
          }
        },
        "dev": {
          "builder": "@nrwl/workspace:run-commands",
          "options": {
            "commands": [
              {
                "command": "node_modules/.bin/env-cmd --file apps/my-project/my-project.dev.env nx run my-project:serve:dev"
              }
            ]
          }
        }
      }
    }
  }
}
```

### Builders

#### Build the Next.js app

Run this command prior to running the app in production mode.

```shell
nx run my-project:build
```

#### Build the custom server

If your app uses a custom server, run this command prior to running the app in production mode.

```shell
nx run my-project:customServer
```

#### Serve the app for development

The custom server will be built automatically before serving.

```shell
nx run my-project:serve:dev
```

#### Serve the app for production

```shell
nx run my-project:serve:production
```

#### Next.js config

```js
// apps/my-project/next.config.js

const { withNx } = require('@yolkai/nx-next');
module.exports = withNx('my-project')({});
```

### Custom server (optional)

```ts
// apps/my-project/server/index.ts

import { StartServerFn } from '@yolkai/nx-next';
import http from 'http';

const startServer: StartServerFn = async (nextApp, options) => {
  const handle = nextApp.getRequestHandler();
  await nextApp.prepare();
  const httpServer = http.createServer((req, res) => {
    handle(req, res);
  });

  return new Promise((resolve, reject) => {
    httpServer.on('error', (err: Error) => {
      if (err) {
        reject(err);
      }
    });
    httpServer.listen(options.port, () => {
      console.log(`listening on http://${options.host}:${options.port}`);
      resolve();
    });
  });
};

export { startServer };
```
