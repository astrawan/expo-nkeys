import { Buffer } from 'buffer';

function encode(bytes: Uint8Array): string {
  return Buffer.from(bytes.buffer).toString('base64');
}

function decode(b64str: string): Uint8Array {
  return new Uint8Array([...Buffer.from(b64str, 'base64')]);
}
export { decode, encode };
