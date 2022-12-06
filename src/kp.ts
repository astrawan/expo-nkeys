import { Codec } from 'nkeys.js/lib/codec';
import { getEd25519Helper } from 'nkeys.js/lib/helper';
import { KP as BaseKP } from 'nkeys.js/lib/kp';
import { NKeysError, NKeysErrorCode } from 'nkeys.js/lib/nkeys';

export class KP extends BaseKP {
  seed?: Uint8Array;

  constructor(seed: Uint8Array) {
    super(seed);
    this.seed = seed;
  }

  getPublicKey(): string {
    if (!this.seed) {
      throw new NKeysError(NKeysErrorCode.ClearedPair);
    }

    const sd = Codec.decodeSeed(this.seed);
    const kp = getEd25519Helper().fromSeed(this.getRawSeed());
    const buf = Codec.encode(sd.prefix, kp.publicKey);
    return String.fromCharCode(...buf);
  }
}
