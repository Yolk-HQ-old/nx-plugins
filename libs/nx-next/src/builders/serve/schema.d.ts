import { JsonObject } from '@angular-devkit/core';

export interface ServeBuilderSchema extends JsonObject {
  dev: boolean;
  buildTarget: string;
  customServerTarget: string | null;
  skipBuild: boolean;
  hostname: string | null;
  port: number;
}
