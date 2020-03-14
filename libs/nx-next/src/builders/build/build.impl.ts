import {
  BuilderContext,
  BuilderOutput,
  createBuilder
} from '@angular-devkit/architect';
import build from 'next/dist/build';
import * as path from 'path';
import { Observable, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { BuildBuilderSchema } from './schema';

export function runBuilder(
  options: BuildBuilderSchema,
  context: BuilderContext
): Observable<BuilderOutput> {
  const root = path.resolve(context.workspaceRoot, options.root);
  return from(build(root)).pipe(
    map(() => ({ success: true })),
    tap(() => {
      context.logger.info('Build complete.');
    })
  );
}

export default createBuilder(runBuilder);
