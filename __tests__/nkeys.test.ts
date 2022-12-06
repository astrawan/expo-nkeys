import { Buffer } from 'buffer';

import { KeyPair, NKeysErrorCode } from 'nkeys.js';
import { NKeysError, Prefix } from 'nkeys.js/lib/nkeys';

import {
  createAccount,
  createOperator,
  createPair,
  createUser,
  fromPublic,
  fromSeed,
} from '../src';

import { createCluster, createServer } from '../src/nkeys';

import { KP } from '../src/kp';

function generateBadSeed(): Uint8Array {
  const a = createAccount();
  const seed = a.getSeed();

  seed[1] = 'S'.charCodeAt(0);

  return seed;
}

function testClear(kp: KeyPair) {
  kp.clear();

  try {
    kp.getPublicKey();
  } catch (e) {
    expect(e).toEqual(new NKeysError(NKeysErrorCode.ClearedPair));
  }

  try {
    kp.getPrivateKey();
  } catch (e) {
    expect(e).toEqual(new NKeysError(NKeysErrorCode.ClearedPair));
  }

  try {
    kp.getSeed();
  } catch (e) {
    expect(e).toEqual(new NKeysError(NKeysErrorCode.ClearedPair));
  }

  try {
    const data = new Uint8Array([...Buffer.from('hello')]);
    kp.sign(data);
  } catch (e) {
    expect(e).toEqual(new NKeysError(NKeysErrorCode.ClearedPair));
  }

  try {
    const data = new Uint8Array([...Buffer.from('hello')]);
    const sig = kp.sign(data);
    kp.verify(data, sig);
  } catch (e) {
    expect(e).toEqual(new NKeysError(NKeysErrorCode.ClearedPair));
  }
}

function test(kp: KeyPair, kind: string) {
  expect(kp).not.toBeNull();

  const seed = kp.getSeed();
  expect(seed[0]).toBe('S'.charCodeAt(0));
  expect(seed[1]).toBe(kind.charCodeAt(0));

  const publicKey = kp.getPublicKey();
  expect(publicKey[0]).toBe(kind.charAt(0));

  const data = new Uint8Array([...Buffer.from('HelloWorld')]);
  const sig = kp.sign(data);
  expect(sig.length).toBe(64);
  expect(kp.verify(data, sig)).toBeTruthy();

  const sk = fromSeed(seed);
  expect(sk.verify(data, sig)).toBeTruthy();

  const pub = fromPublic(publicKey);
  expect(pub.getPublicKey()).toBe(publicKey);
  expect(pub.verify(data, sig)).toBeTruthy();
  try {
    pub.getPrivateKey();
  } catch (e) {
    expect(e).toEqual(new NKeysError(NKeysErrorCode.PublicKeyOnly));
  }

  testClear(kp);
  testClear(pub);
}

describe('nkeys', () => {
  it('operator', () => {
    test(createOperator(), 'O');
  });

  it('account', () => {
    test(createAccount(), 'A');
  });

  it('user', () => {
    test(createUser(), 'U');
  });

  it('cluster', () => {
    test(createCluster(), 'C');
  });

  it('server', () => {
    test(createServer(), 'N');
  });

  it('should fail with non public prefix', () => {
    try {
      createPair(Prefix.Private);
    } catch (e) {
      expect(e).toEqual(new NKeysError(NKeysErrorCode.InvalidPrefixByte));
    }
  });

  it('should fail getting public key on bad seed', () => {
    try {
      const kp = new KP(new Uint8Array([...Buffer.from('SEEDBAD')]));
      kp.getPublicKey();
      createPair(Prefix.Private);
    } catch (e) {
      expect(e).toEqual(new NKeysError(NKeysErrorCode.InvalidChecksum));
    }
  });

  it('should fail getting private key on bad seed', () => {
    try {
      const kp = new KP(new Uint8Array([...Buffer.from('SEEDBAD')]));
      kp.getPrivateKey();
      createPair(Prefix.Private);
    } catch (e) {
      expect(e).toEqual(new NKeysError(NKeysErrorCode.InvalidChecksum));
    }
  });

  it('should fail signing on bad seed', () => {
    try {
      const kp = new KP(new Uint8Array([...Buffer.from('SEEDBAD')]));
      kp.sign(new Uint8Array([...Buffer.from('HelloWorld')]));
      createPair(Prefix.Private);
    } catch (e) {
      expect(e).toEqual(new NKeysError(NKeysErrorCode.InvalidChecksum));
    }
  });

  it('fromSeed should reject decoding bad seed prefix', () => {
    try {
      const s = generateBadSeed();
      fromSeed(s);
    } catch (e) {
      expect(e).toEqual(new NKeysError(NKeysErrorCode.InvalidChecksum));
    }
  });

  it('fromSeed should reject decoding bad public key', () => {
    try {
      const s = generateBadSeed();
      fromPublic(String.fromCharCode(...s));
    } catch (e) {
      expect(e).toEqual(new NKeysError(NKeysErrorCode.InvalidChecksum));
    }
  });

  it('public key cannot sign', () => {
    try {
      const a = createAccount();
      const pks = a.getPublicKey();
      const pk = fromPublic(pks);
      const pks2 = pk.getPublicKey();

      expect(pks).toEqual(pks2);

      pk.sign(new Uint8Array([...Buffer.from('')]));
    } catch (e) {
      expect(e).toEqual(new NKeysError(NKeysErrorCode.CannotSign));
    }
  });

  it('from public rejects non-public keys', () => {
    try {
      const a = createAccount();
      const pks = a.getSeed();
      fromPublic(String.fromCharCode(...pks));
    } catch (e) {
      expect(e).toEqual(new NKeysError(NKeysErrorCode.InvalidPublicKey));
    }
  });
});
