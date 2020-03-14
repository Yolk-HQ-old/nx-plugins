import '../../utils/workspaceHotfix';
import { MockBuilderContext } from '@nrwl/workspace/testing';
import * as build from 'next/dist/build';
import { getMockContext } from '../../utils/testing';
import {} from '../../utils/types';
import { runBuilder } from './build.impl';
import { BuildBuilderSchema } from './schema';

jest.mock('next/dist/build');

describe('Next.js Builder', () => {
  let context: MockBuilderContext;
  let options: BuildBuilderSchema;

  beforeEach(async () => {
    context = await getMockContext();

    options = {
      root: 'apps/wibble',
      outputPath: 'dist/apps/wibble'
    };

    jest.spyOn(build, 'default').mockReturnValue(Promise.resolve());
  });

  it('should call next build', async () => {
    await runBuilder(options, context).toPromise();

    expect(build.default).toHaveBeenCalledWith('/root/apps/wibble');
  });
});
