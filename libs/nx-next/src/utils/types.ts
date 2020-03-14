import next from 'next';
import { ServeBuilderSchema } from '../builders/serve/schema';

type NextServer = ReturnType<typeof next>;

/**
 * If a `customServerTarget` is provided to the 'serve' builder, it's assumed to export
 * a `StartServerFn` function.
 * Nx will call this function when dev-server command is run. This function should call
 * `nextApp.prepare()`, and then start an HTTP server on the given `settings.port`.
 */
export type StartServerFn = (
  nextApp: NextServer,
  settings: ServeBuilderSchema
) => Promise<void>;
