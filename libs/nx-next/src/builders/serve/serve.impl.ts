import {
  BuilderContext,
  BuilderOutput,
  createBuilder,
  scheduleTargetAndForget,
  targetFromTargetString,
} from '@angular-devkit/architect';
import { terminal } from '@angular-devkit/core';
import * as fs from 'fs';
import {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_SERVER,
} from 'next/dist/next-server/lib/constants';
import * as path from 'path';
import { from, Observable, of } from 'rxjs';
import { concatMap, switchMap, tap } from 'rxjs/operators';
import { prepareConfig } from '../../utils/config';
import {
  NextBuildBuilderOptions,
  NextServeBuilderOptions,
  NextServer,
  NextServerOptions,
  ProxyConfig,
} from '../../utils/types';
import { customServer } from './lib/custom-server';
import { defaultServer } from './lib/default-server';

try {
  require('dotenv').config();
} catch (e) {}

export default createBuilder<NextServeBuilderOptions>(run);

const infoPrefix = `[ ${terminal.dim(terminal.cyan('info'))} ] `;
const readyPrefix = `[ ${terminal.green('ready')} ]`;

export function run(
  options: NextServeBuilderOptions,
  context: BuilderContext,
): Observable<BuilderOutput> {
  const buildTarget = targetFromTargetString(options.buildTarget);
  const baseUrl = `http://${options.hostname || 'localhost'}:${options.port}`;

  const build$ = !options.dev
    ? scheduleTargetAndForget(context, buildTarget)
    : of({ success: true });

  return build$.pipe(
    concatMap(r => {
      if (!r.success) return of(r);
      return from(context.getTargetOptions(buildTarget)).pipe(
        concatMap((buildOptions: NextBuildBuilderOptions) => {
          const root = path.resolve(context.workspaceRoot, buildOptions.root);

          const config = prepareConfig(
            context.workspaceRoot,
            buildOptions.root,
            buildOptions.outputPath,
            buildOptions.fileReplacements,
            options.dev ? PHASE_DEVELOPMENT_SERVER : PHASE_PRODUCTION_SERVER,
          );

          const settings: NextServerOptions = {
            dev: options.dev,
            dir: root,
            staticMarkup: options.staticMarkup,
            quiet: options.quiet,
            conf: config,
            port: options.port,
            path: options.customServerPath,
            hostname: options.hostname,
          };

          const server: NextServer = options.customServerPath ? customServer : defaultServer;

          // look for the proxy.conf.json
          let proxyConfig: ProxyConfig;
          const proxyConfigPath = options.proxyConfig
            ? path.join(context.workspaceRoot, options.proxyConfig)
            : path.join(root, 'proxy.conf.json');
          if (fs.existsSync(proxyConfigPath)) {
            context.logger.info(`${infoPrefix} found proxy configuration at ${proxyConfigPath}`);
            proxyConfig = require(proxyConfigPath);
          }

          return from(server(settings, proxyConfig)).pipe(
            tap(() => {
              context.logger.info(`${readyPrefix} on ${baseUrl}`);
            }),
            switchMap(
              e =>
                new Observable<BuilderOutput>(obs => {
                  obs.next({
                    baseUrl,
                    success: true,
                  });
                }),
            ),
          );
        }),
      );
    }),
  );
}
