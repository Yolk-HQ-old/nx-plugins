# nx-plugins

A collection of Nx plugins.

- [@yolkai/nx-next](libs/nx-next)

## Contributing

### Setup

```shell
npm install --global pnpm@4
pnpm install --recursive
```

### Run tests

```shell
pnpm run nx -- run-many --target test --all
pnpm run nx -- run-many --target e2e --all
```

### Publish a plugin

```shell
pnpm run nx -- run nx-next:build
pnpm publish ./dist/libs/nx-next
```

### Create a new plugin

```shell
pnpm run nx -- generate @nrwl/nx-plugin:plugin [pluginName]
```
