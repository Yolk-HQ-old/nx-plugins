import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { join } from 'path';

import { ExampleSchematicSchema } from './schema';

describe('example schematic', () => {
  let appTree: Tree;
  const options: ExampleSchematicSchema = { name: 'test' };

  const testRunner = new SchematicTestRunner(
    '@yolkai/nx-next',
    join(__dirname, '../../../collection.json')
  );

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty());
  });

  it('should run successfully', async () => {
    await expect(
      testRunner.runSchematicAsync('example', options, appTree).toPromise()
    ).resolves.not.toThrowError();
  });
});
