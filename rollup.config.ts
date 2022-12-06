import typescript from '@rollup/plugin-typescript';

import type { RollupOptions } from 'rollup';

// Remember enable compilerOptions > resolveJsonModule = true option
// in tsconfig.json
import * as pkg from './package.json' assert { type: 'json' };

const configs: RollupOptions[] = [
  {
    input: 'src/index.ts',
    output: [
      {
        dir: 'lib',
        file: pkg.main,
        format: 'esm',
        exports: 'named',
        sourcemap: 'inline',
      },
    ],
    plugins: [typescript({ tsconfig: './tsconfig.lib.json' })],
    external: [...Object.keys(pkg.peerDependencies || {})],
  },
];

export default configs;
