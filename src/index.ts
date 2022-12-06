import { setEd25519Helper } from 'nkeys.js/lib/helper';

import { helper } from './deps';

setEd25519Helper(helper);

export * from './mod';
