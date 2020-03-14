import { offsetFromRoot, readWorkspaceJson } from '@nrwl/workspace';
import { appRootPath } from '@nrwl/workspace/src/utils/app-root';
import * as path from 'path';
import TsConfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import * as webpack from 'webpack';

// https://github.com/zeit/next.js/blob/6b87b2b5410867cad7fbc13caebba33d727bc3ba/docs/api-reference/next.config.js/custom-webpack-config.md
interface NextBuildOptions {
  buildId: string;
  dev: boolean;
  isServer: boolean;
  defaultLoaders: { [name: string]: object };
  webpack: typeof webpack;
}

/**
 * A Next.js configuration enhancer which must be used to ensure Next.js output is written to
 * the correct directory, and to ensure TypeScript sources are compiled when imported from other
 * packages in the workspace.
 *
 * @example
 *   // myapp/next.config.js
 *   const { withNx } = require('@yolkai/nx-next');
 *   module.exports = withNx('myapp')({});
 */
const withNx = (projectName: string) => (nextConfig: any = {}) => {
  const projects = readWorkspaceJson().projects;
  const thisProject = projects[projectName];

  const distDir = path.join(
    offsetFromRoot(thisProject.root),
    thisProject.architect.build.options.outputPath
  );

  return {
    ...nextConfig,
    distDir,
    webpack: (config: webpack.Configuration, options: NextBuildOptions) => {
      /* eslint-disable @typescript-eslint/no-non-null-assertion */
      // Non-null assertion is allowed here because we know Next.js has defined `config.resolve`
      // and `config.module` prior to this function being called

      // Use TsConfigPathsPlugin to resolve intra-monorepo imports between projects.
      config.resolve!.plugins = [
        new TsConfigPathsPlugin({
          configFile: path.resolve(appRootPath, 'tsconfig.json'),
          extensions: config.resolve!.extensions,
          mainFields: config.resolve!.mainFields as string[]
        })
      ];

      // Ensure .ts/.tsx sources are compiled for all projects in the monorepo.
      const projectsSourceRoots = Object.values(projects).map((project: any) =>
        path.join(appRootPath, project.sourceRoot)
      );
      config.module!.rules.push({
        test: /\.(tsx|ts)$/,
        include: projectsSourceRoots,
        use: [options.defaultLoaders.babel]
      });
      /* eslint-enable */
      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }
      return config;
    }
  };
};

export { withNx };
