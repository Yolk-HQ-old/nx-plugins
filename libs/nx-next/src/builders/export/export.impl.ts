import {
  BuilderContext,
  BuilderOutput,
  createBuilder,
  scheduleTargetAndForget,
  targetFromTargetString
} from '@angular-devkit/architect';
import exportApp from 'next/dist/export';
import * as path from 'path';
import { from, Observable, of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';

import { ExportBuilderSchema } from './schema';
import { BuildBuilderSchema } from '../build/schema';

function runBuilder(
  options: ExportBuilderSchema,
  context: BuilderContext
): Observable<BuilderOutput> {
  const buildTarget = targetFromTargetString(options.buildTarget);
  const build$ = scheduleTargetAndForget(context, buildTarget);

  return build$.pipe(
    concatMap(r => {
      if (!r.success) return of(r);
      return from(context.getTargetOptions(buildTarget)).pipe(
        concatMap(buildOptions_ => {
          const buildOptions = buildOptions_ as BuildBuilderSchema;
          const root = path.resolve(context.workspaceRoot, buildOptions.root);
          return from(
            exportApp(root, { outdir: `${buildOptions.outputPath}/exported` })
          ).pipe(map(() => ({ success: true })));
        })
      );
    })
  );
}

export default createBuilder<ExportBuilderSchema>(runBuilder);
