import { Target } from '@angular-devkit/architect';
import { JsonObject } from '@angular-devkit/core';

/**
 * Augment the `MockBuilderContext` interface with the correct type for `getProjectMetadata`.
 * Without this augmentation, the following error occurs:
 *
 * > nx run nx-next:build
 * Compiling TypeScript files for library nx-next...
 * node_modules/.pnpm/registry.npmjs.org/@nrwl/workspace/9.1.2_prettier@1.19.1/node_modules/@nrwl/workspace/src/utils/testing-utils.d.ts:33:5 - error TS2416: Property 'getProjectMetadata' in type 'MockBuilderContext' is not assignable to the same property in base type 'BuilderContext'.
 *   Type '(target: string | Target) => Promise<JsonObject | null>' is not assignable to type '{ (projectName: string): Promise<JsonObject>; (target: Target): Promise<JsonObject>; }'.
 *     Type 'Promise<JsonObject | null>' is not assignable to type 'Promise<JsonObject>'.
 *       Type 'JsonObject | null' is not assignable to type 'JsonObject'.
 *         Type 'null' is not assignable to type 'JsonObject'.
 *
 * 33     getProjectMetadata(target: Target | string): Promise<json.JsonObject | null>;
 *        ~~~~~~~~~~~~~~~~~~
 *
 * TODO: report an issue on https://github.com/nrwl/nx
 */
declare module '@nrwl/workspace/src/utils/testing-utils' {
  interface MockBuilderContext {
    getProjectMetadata(target: Target | string): Promise<JsonObject>;
  }
}
