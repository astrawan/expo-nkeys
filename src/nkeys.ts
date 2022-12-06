import { Buffer } from 'buffer';
import { Codec } from 'nkeys.js/lib/codec';
import { getEd25519Helper } from 'nkeys.js/lib/helper';
import {
  KeyPair,
  NKeysError,
  NKeysErrorCode,
  Prefix,
  Prefixes,
} from 'nkeys.js/lib/nkeys';
import { PublicKey } from './public';

import { KP } from './kp';

export function createPair(prefix: Prefix): KeyPair {
  const rawSeed = getEd25519Helper().randomBytes(32);
  const str = Codec.encodeSeed(prefix, new Uint8Array(rawSeed));

  return new KP(str);
}

export function createOperator(): KeyPair {
  return createPair(Prefix.Operator);
}

export function createAccount(): KeyPair {
  return createPair(Prefix.Account);
}

export function createUser(): KeyPair {
  return createPair(Prefix.User);
}

export function createCluster(): KeyPair {
  return createPair(Prefix.Cluster);
}

export function createServer(): KeyPair {
  return createPair(Prefix.Server);
}

export function fromPublic(src: string): KeyPair {
  const ba = new Uint8Array([...Buffer.from(src)]);
  // eslint-disable-next-line no-underscore-dangle
  const raw = Codec._decode(ba);
  const prefix = Prefixes.parsePrefix(raw[0]);
  if (Prefixes.isValidPublicPrefix(prefix)) {
    return new PublicKey(ba);
  }
  throw new NKeysError(NKeysErrorCode.InvalidPublicKey);
}

export function fromSeed(src: Uint8Array): KeyPair {
  Codec.decodeSeed(src);

  return new KP(src);
}
