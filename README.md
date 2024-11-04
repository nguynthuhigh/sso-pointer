<p align="center">
  <a href="https://auth.pointer.io.vn/" target="blank"><img src="https://i.imgur.com/5cYzRrm.png" width="120" alt="Pointer Logo" /></a>
</p>

**[OAuth Pointer Node.js Library](https://pointer.io.vn/)**

**[OAuth Pointer Github](https://github.com/nguynthuhigh/oauth-pointer-npm)**

# Installing

```
npm install oauth-pointer
# or
yarn add oauth-pointer
```

# Documentation

# Usage

> [!NOTE]
> The package needs clientId, clientSecret to configure, which you can get at **[Pointer Apps](https://auth.pointer.io.vn/)**

```typescript
import { PointerStrategy } from 'oauth-pointer';

const pointer = new PointerStrategy({
  clientId: process.env.POINTER_CLIENT_ID,
  clientSecret: process.env.POINTER_CLIENT_SECRET,
  callbackUrl: process.env.POINTER_CALLBACK_URL,
});
const accessToken = await pointer.getAccessToken('code');
console.log(accessToken);
```

or Javascript

```javascript
const { PointerStrategy } = require('oauth-pointer');

const pointer = new PointerStrategy({
  clientId: process.env.POINTER_CLIENT_ID,
  clientSecret: process.env.POINTER_CLIENT_SECRET,
  callbackUrl: process.env.POINTER_CALLBACK_URL,
});
const accessToken = await pointer.getAccessToken('code');
console.log(accessToken);
```
