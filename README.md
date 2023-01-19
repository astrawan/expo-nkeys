<!-- -*- mode: markdown -*- -->
<!-- template-checksum: 9099abc5b63eeda550e2381f4e791d327aaf6835 -->
<!-- branch: main -->
# expo-nkeys


A Expo/React Native wrapper for [nkeys.js](https://github.com/nats-io/nkeys.js) library.

[![license-badge](https://img.shields.io/github/license/astrawan/expo-nkeys?logo=Open%20Source%20Initiative)](https://github.com/astrawan/expo-nkeys/blob/main/LICENSE)
[![ci-badge](https://img.shields.io/github/actions/workflow/status/astrawan/expo-nkeys/test.yml?label=CI&logo=GitHub&branch=main)](https://github.com/astrawan/expo-nkeys/actions?query=branch%3Amain)
[![code-quality-badge](https://img.shields.io/codacy/grade/b4756ea6a53346db8cfaf9e27111e72c/main?logo=Codacy)](https://www.codacy.com/gh/astrawan/expo-nkeys/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=astrawan/expo-nkeys&amp;utm_campaign=Badge_Grade)
[![coverage-badge](https://img.shields.io/codacy/coverage/b4756ea6a53346db8cfaf9e27111e72c/main?logo=Jest)](https://www.codacy.com/gh/astrawan/expo-nkeys/dashboard?utm_source=github.com&utm_medium=referral&utm_content=astrawan/expo-nkeys&utm_campaign=Badge_Coverage)
[![published-version-badge](https://img.shields.io/npm/v/expo-nkeys?logo=npm)](https://www.npmjs.com/package/expo-nkeys)
[![vulnerabilities-badge](https://img.shields.io/snyk/vulnerabilities/npm/expo-nkeys?logo=Snyk)](https://snyk.io/advisor/npm-package/expo-nkeys)

## Installation
On expo, and react native project you can get a build from npm:
```bash
npm install expo-nkeys
```

In your node projects:
```javascript
import {
  createUser,
  fromPublic,
  fromSeed,
} from 'expo-nkeys';
```


## Basic Usage
The [documentation is here](https://nats-io.github.io/nkeys.js/)

```typescript
// create an user nkey KeyPair (can also create accounts, operators, etc).
const user = createUser();

// A seed is the public and private keys together.
const seed: Uint8Array = user.getSeed();

// Seeds are encoded into Uint8Array, and start with
// the letter 'S'. Seeds need to be kept safe and never shared
console.log(`seeds start with s: ${seed[0] === "S".charCodeAt(0)}`);

// A seed's second letter encodes it's type:
// `U` for user,
// `A` for account,
// `O` for operators
console.log(`nkey is for a user? ${seed[1] === "U".charCodeAt(0)}`);

// To view a seed, simply decode it:
console.log(new TextDecoder().decode(seed));

// you can recreate the keypair with its seed:
const priv = fromSeed(seed);

// Using the KeyPair, you can cryptographically sign content:
const data = new TextEncoder().encode("Hello World!");
const sig = priv.sign(data);

// and verify a signature:
const valid = user.verify(data, sig);
if (!valid) {
  console.error("couldn't validate the data/signature against my key");
} else {
  console.error("data was verified by my key");
}

// others can validate using your public key:
const publicKey = user.getPublicKey();
const pub = fromPublic(publicKey);
if (!pub.verify(data, sig)) {
  console.error(`couldn't validate the data/signature with ${publicKey}`);
} else {
  console.info(`data was verified by ${publicKey}`);
}

// when extracting with seeds or private keys
// you should clear them when done:
seed.fill(0);

// you should also clear the keypairs:
user.clear();
priv.clear();
```

## Example

Here is a screenshot of the [sample application](https://github.com/astrawan/expo-nkeys-demo):

![Screenshot of Demo App](https://raw.githubusercontent.com/astrawan/expo-nkeys-demo/main/assets/demo.png)
