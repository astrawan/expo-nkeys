# expo-nkeys


A wrapper library for public-key signature system based on Ed25519 for the [NATS ecosystem system](https://nats.io) for JavaScript.

The expo-nkeys library works in expo or react native!

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

## Demo

![Demo Application](assets/demo-ios.png "Demo")

![Scan the following QR code with an iOS device to open it in Expo Go or a development build.](https://qr.expo.dev/eas-update?updateId=8288e9a8-f81f-47d0-b4ee-0aa0e38c529d&appScheme=exp&host=u.expo.dev "Expo Go iOS")

![Scan the following QR code with an Android device to open it in Expo Go or a development build.](https://qr.expo.dev/eas-update?updateId=3fc60764-4749-4328-bbad-23ccc5a18277&appScheme=exp&host=u.expo.dev "Expo Go Android")

The [repository is here](https://github.com/astrawan/expo-nkeys-demo)
