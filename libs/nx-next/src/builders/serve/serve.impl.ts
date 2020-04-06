import * as http from 'http';
import next from 'next';
import * as path from 'path';
import { forkJoin, from, Observable, of } from 'rxjs';
import { concatMap, switchMap, tap } from 'rxjs/operators';

import {
  BuilderContext,
  BuilderOutput,
  createBuilder,
  scheduleTargetAndForget,
  targetFromTargetString
} from '@angular-devkit/architect';
import { terminal } from '@angular-devkit/core';

import { StartServerFn } from '../../utils/types';
import { BuildBuilderSchema } from '../build/schema';
import { ServeBuilderSchema } from './schema';

/**
 * A simple default server implementation to be used if no `customServerTarget` is provided.
 */
const defaultStartServer: StartServerFn = async (nextApp, options) => {
  const handle = nextApp.getRequestHandler();
  await nextApp.prepare();
  const server = http.createServer((req, res) => {
    handle(req, res);
  });
  return new Promise((resolve, reject) => {
    server.on('error', (error: Error) => {
      if (error) {
        reject(error);
      }
    });
    if (options.hostname) {
      server.listen(options.port, options.hostname, () => {
        resolve();
      });
    } else {
      server.listen(options.port, () => {
        resolve();
      });
    }
  });
};

const infoPrefix = `[ ${terminal.dim(terminal.cyan('info'))} ] `;
const readyPrefix = `[ ${terminal.green('ready')} ]`;

export function runBuilder(
  options: ServeBuilderSchema,
  context: BuilderContext
): Observable<BuilderOutput> {
  const buildTarget = targetFromTargetString(options.buildTarget);
  const customServerTarget =
    options.customServerTarget && targetFromTargetString(options.customServerTarget);
  const baseUrl = `http://${options.hostname || 'localhost'}:${options.port}`;

  const success: BuilderOutput = { success: true };
  let build$;
  if (!options.dev && !options.skipBuild) {
    context.logger.info(`${infoPrefix} building buildTarget ${options.buildTarget}`);
    build$ = scheduleTargetAndForget(context, buildTarget);
  } else {
    context.logger.info(`${infoPrefix} skipping buildTarget ${options.buildTarget}`);
    build$ = of(success);
  }

  let customServer$;
  if (customServerTarget && !options.skipBuild) {
    context.logger.info(`${infoPrefix} building customServerTarget ${options.customServerTarget}`);
    customServer$ = scheduleTargetAndForget(context, customServerTarget);
  } else {
    if (customServerTarget) {
      context.logger.info(`${infoPrefix} skipping customServerTarget ${options.buildTarget}`);
    } else {
      context.logger.info(`${infoPrefix} no customServerTarget provided; using built-in server`);
    }
    customServer$ = of(success);
  }

  return forkJoin(build$, customServer$).pipe(
    concatMap(([buildResult, customServerResult]) => {
      if (!buildResult.success) return of(buildResult);
      if (!customServerResult.success) return of(customServerResult);

      return from(context.getTargetOptions(buildTarget)).pipe(
        concatMap(buildOptions_ => {
          const buildOptions = buildOptions_ as BuildBuilderSchema;
          const root = path.resolve(context.workspaceRoot, buildOptions.root as string);

          const nextApp = next({
            dev: options.dev,
            dir: root
          });

          let server$: Observable<void>;
          if (customServerTarget) {
            server$ = from(context.getTargetOptions(customServerTarget)).pipe(
              concatMap(customServerOptions => {
                const customServerEntry = path.join(
                  context.workspaceRoot,
                  customServerOptions.outputPath as string,
                  'main.js'
                );
                const startServer: StartServerFn = require(customServerEntry).startServer;
                return from(startServer(nextApp, options));
              })
            );
          } else {
            const startServer: StartServerFn = defaultStartServer;
            server$ = from(startServer(nextApp, options));
          }

          return server$.pipe(
            tap(() => {
              context.logger.info(`${readyPrefix} on ${baseUrl}`);
            }),
            switchMap(
              () =>
                new Observable<BuilderOutput>(obs => {
                  obs.next({
                    baseUrl,
                    success: true
                  });
                })
            )
          );
        })
      );
    })
  );
}

export default createBuilder<ServeBuilderSchema>(runBuilder);
