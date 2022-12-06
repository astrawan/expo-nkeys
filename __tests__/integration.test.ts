import { Codec } from 'nkeys.js/lib/codec';

import { decode, encode, fromPublic, fromSeed, Prefix } from '../src';

// this was generated using nkey api in go
const data = {
  seed: 'SAAFYOZ5U4UBAJMHPITLSKDWAFBJNWH53K7LPZDQKOC5TXAGBIP4DY4WCA',
  public_key: 'AAASUT7FDZDS6UCTBE7JQS2G6KUZBJC5YW7VFVK45JLUK3UDVA6NXJWD',
  private_key:
    'PBODWPNHFAICLB32E24SQ5QBIKLNR7O2X236I4CTQXM5YBQKD7A6GAJKJ7SR4RZPKBJQSPUYJNDPFKMQURO4LP2S2VOOUV2FN2B2QPG3AHUA',
  nonce: 'uPMbFqF4nSX75B0Nlk9uug==',
  sig: 'y9t/0VxLZET6fYlSL7whq52TSv8tP7FBXZdqbQhfdpKCa3pveV7889zqkpiQcv8ivwtACQwumPe6EgrxFc7yDw==',
};

describe('integration', () => {
  it('verify', () => {
    const pk = fromPublic(data.public_key);
    const nonce = new Uint8Array([...Buffer.from(data.nonce)]);
    const sig = decode(data.sig);

    expect(pk.verify(nonce, sig)).toBeTruthy();

    const seed = fromSeed(new Uint8Array([...Buffer.from(data.seed)]));
    expect(seed.verify(nonce, sig)).toBeTruthy();
    const sig2 = seed.sign(nonce);
    const encsig = encode(sig2);

    expect(encsig).toBe(data.sig);
  });

  it('encoded seed returns stable values albertor', () => {
    const data1 = {
      seed: 'SUAGC3DCMVZHI33SMFWGEZLSORXXEYLMMJSXE5DPOJQWYYTFOJ2G64VAPY',
      public_key: 'UAHJLSMYZDJCBHQ2SARL37IEALR3TI7VVPZ2MJ7F4SZKNOG7HJJIYW5T',
      private_key:
        'PBQWYYTFOJ2G64TBNRRGK4TUN5ZGC3DCMVZHI33SMFWGEZLSORXXEDUVZGMMRURATYNJAIV57UCAFY5ZUP22X45GE7S6JMVGXDPTUUUMRKXA',
      nonce: 'P6Gz7PfS+Cqt0qTgheqa9w==',
      sig: 'Dg8/bNrSx/TqBiETRjkVIa3+vx8bQc/DcoFBuFfUiHAEWDsSkzNLgseZlP+x9ndVCoka6YpDIoTzc5NjHTgPCA==',
    };

    const v = Codec.encodeSeed(
      Prefix.User,
      new Uint8Array([...Buffer.from('albertoralbertoralbertoralbertor')])
    );
    expect(String.fromCharCode(...v)).toBe(data1.seed);

    const kp = fromSeed(v);
    expect(String.fromCharCode(...kp.getSeed())).toBe(data1.seed);
    expect(kp.getPublicKey()).toBe(data1.public_key);
    expect(String.fromCharCode(...kp.getPrivateKey())).toBe(data1.private_key);
  });
});
