import { JsonObject } from '@angular-devkit/core';

export interface ExportBuilderSchema extends JsonObject {
  buildTarget: string;
}
