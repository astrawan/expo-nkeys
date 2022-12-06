import * as nacl from 'tweetnacl';

import * as Random from 'expo-random';

import type { Ed25519Helper } from 'nkeys.js/lib/helper';

nacl.setPRNG(function prng(x, n) {
  const v = Random.getRandomBytes(32);
  // eslint-disable-next-line no-param-reassign
  for (let i = 0; i < n; i += 1) x[i] = v[i];
  for (let i = 0; i < v.length; i += 1) v[i] = 0;
});

export const helper = {
  fromSeed: nacl.sign.keyPair.fromSeed,
  sign: nacl.sign.detached,
  verify: nacl.sign.detached.verify,
  randomBytes: nacl.randomBytes,
} as Ed25519Helper;
