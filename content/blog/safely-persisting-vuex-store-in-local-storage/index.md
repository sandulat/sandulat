---
title: Safely persisting Vuex store in local storage
date: '2020-03-03'
description: Find out how the centralized store of your Vue app can be safely persisted in the local storage.
featuredImage: featured-image.png
emoji: 🔐
---

If you're building a Vue front-end app, you're most probably using Vuex as your centralized store. Usually stores are being persisted in the local storage, since cookies have a max size of 4KB, so local storage is one of your only real alternative options. However, the majority of developers store data in local storage, in it's raw version (pure JSON). Local storage isn't secure as a concept, so if you're persisting any of user's data there, you should encrypt it.

### Vuex Persist

For persisting my Vuex store, I'm usually using the plugin [vuex-persist](https://github.com/championswimmer/vuex-persist), which can be installed by running:

```bash
npm install --save vuex-persist

# or

yarn add vuex-persist
```

The usage is straightforward:

```js
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
});

const store = new Vuex.Store({
  plugins: [vuexLocal.plugin],
});
```

And thats it. Now your store is persisted inside browser's local storage.

### Vuex Persist Getters & Setters

The `storage` key passed to `VuexPersistence` constructor doesn't have to necessarily be `window.localStorage`. It must be an object implementing the methods `getItem`, `setItem`, `removeItem`. In fact, the prototype of `window.localStorage` implements these methods and that's why you can pass it directly.

```js
new VuexPersistence({
  storage: {
    // Get the store (for e.g. from local storage)
    getItem: () => {},
    // Set the store (for e.g. in local storage)
    setItem: (key, value) => {},
    // Remove the store (for e.g. from local storage)
    removeItem: () => {},
  },
});
```

### Encrypting Vuex Persisted Store

My personal approach for persisting the store securely:

- Generate a random UUID and store it in a secure cookie.
- Encrypt the store in the `setItem` setter, using the generated UUID.
- Decrypt the store in the `getItem` getter, using the generated UUID.
- Clear the store if the decryption fails in the getter.

For encryption we can use [crypto-js](https://www.npmjs.com/package/crypto-js), which can be installed by running:

```bash
npm install --save crypto-js

# or

yarn add crypto-js
```

For cookies we can use [js-cookie](https://www.npmjs.com/package/js-cookie), which can be installed by running:

```bash
npm install --save js-cookie

# or

yarn add js-cookie
```

For UUID generation we can use [uuid](https://www.npmjs.com/package/uuid), which can be installed by running:

```bash
npm install --save uuid

# or

yarn add uuid
```

And this is how the entire thing would look:

```js
import VuexPersistence from 'vuex-persist';
import Crypto from 'crypto-js';
import Cookie from 'js-cookie';
import uuid from 'uuid';

const cookieName = 'cookieName';

const storageKey = 'storageKey';

// Get the encryption token from cookie or generate a new one.
const encryptionToken = Cookie.get(cookieName) || uuid.v4();

// Store the encryption token in a secure cookie.
Cookie.set(cookieName, encryptionToken, { secure: true, expires: 180 });

const vuexLocal = new VuexPersistence({
  storage: {
    getItem: () => {
      // Get the store from local storage.
      const store = window.localStorage.getItem(storageKey);

      if (store) {
        try {
          // Decrypt the store retrieved from local storage
          // using our encryption token stored in cookies.
          const bytes = Crypto.AES.decrypt(store, encryptionToken);

          return JSON.parse(bytes.toString(Crypto.enc.Utf8));
        } catch (e) {
          // The store will be reset if decryption fails.
          window.localStorage.removeItem(storageKey);
        }
      }

      return null;
    },
    setItem: (key, value) => {
      // Encrypt the store using our encryption token stored in cookies.
      const store = Crypto.AES.encrypt(value, encryptionToken).toString();

      // Save the encrypted store in local storage.
      return window.localStorage.setItem(storageKey, store);
    },
    removeItem: () => window.localStorage.removeItem(storageKey),
  },
});

export default vuexLocal.plugin;
```

Keep in mind that all the encryption logic is **still exposed to the client**. However, it's still much better than keeping the raw store persisted in local storage.

---

Hey, thanks for reading this post! Subscribe below and get notified when new posts will be released or follow me on [Twitter (@sandulat)](https://twitter.com/sandulat).
