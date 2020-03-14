import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { join } from 'path';

import { NxNextSchematicSchema } from './schema';

describe('nx-next schematic', () => {
  let appTree: Tree;
  const options: NxNextSchematicSchema = { name: 'test' };

  const testRunner = new SchematicTestRunner(
    '@yolkai/nx-next',
    join(__dirname, '../../../collection.json')
  );

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty());
  });

  it('should run successfully', async () => {
    await expect(
      testRunner.runSchematicAsync('nxNext', options, appTree).toPromise()
    ).resolves.not.toThrowError();
  });
});
