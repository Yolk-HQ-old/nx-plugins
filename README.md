# nx-plugins

A collection of Nx plugins.

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

### Creating a new plugin

```shell
pnpm run nx -- generate @nrwl/nx-plugin:plugin [pluginName]
```
