import { NKeysError, NKeysErrorCode } from 'nkeys.js/lib/nkeys';
import { PublicKey as BasePublicKey } from 'nkeys.js/lib/public';

export class PublicKey extends BasePublicKey {
  publicKey?: Uint8Array;

  constructor(publicKey: Uint8Array) {
    super(publicKey);

    this.publicKey = publicKey;
  }

  getPublicKey(): string {
    if (!this.publicKey) {
      throw new NKeysError(NKeysErrorCode.ClearedPair);
    }

    return String.fromCharCode(...this.publicKey);
  }
}
