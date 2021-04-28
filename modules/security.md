# Security

Moleculer provides some default hooks to ensure incoming requests are authenticated and authorized. You can enable 
authentication and authorization in the API Gateway service's `routes` configuration. Once enabled, every request 
received by the API Gateway will result in a call to the `authenticate` and `authorize` methods (located near the bottom
 of the service source code). 
 
The code in the `authenticate` and `authorize` methods (on the main branch) was provided as a simple demonstration of 
how the methods can work, but you are expected to provide your own implementation when you enable them. In this part of 
the lab we will implement authentication and authorization using Jason Web Tokens (JWTs), which are a common way of 
authenticating request without the use of credentials (one benefit being that we don't need to pass credentials around
from service to service). You can look at the `security` branch to see a working sample of the code if you get stuck or 
have questions.

### Generate JWTs

To generate some JWTs, you run the command `node makeJWTs.js` from the root of the project. This will generate three
token that you can use (you will see something like the following on the command line):

```
$ node makeJWTs.js 
Alice (Roles -> [Admin, User]): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NSIsImlzcyI6InBldHN0b3JlLmNvbSIsIm5hbWUiOiJBbGljZSIsInJvbGVzIjpbIkFETUlOIiwiVVNFUiJdLCJpYXQiOjE2MTk2NDQzODQsImV4cCI6MTYyMDI0OTE4NH0.BzRKaR7NrocsY31lj6r0yy07Z3JDCc_0VoP9PsCm_qQ

Bob (Roles -> [User]): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2Nzg5MCIsImlzcyI6InBldHN0b3JlLmNvbSIsIm5hbWUiOiJCb2IiLCJyb2xlcyI6WyJVU0VSIl0sImlhdCI6MTYxOTY0NDM4NCwiZXhwIjoxNjIwMjQ5MTg0fQ.Dc3SEpJSDjGWvyb6ZddXFG1UFovio64nK2I7BvSv90w

Malicious Mel (Roles -> []): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0NzU4MzIiLCJpc3MiOiJwZXRzdG9yZS5jb20iLCJuYW1lIjoiTWFsaWNpb3VzIE1lbCIsInJvbGVzIjpbXSwiaWF0IjoxNjE5NjQ0Mzg0LCJleHAiOjE2MjAyNDkxODR9.t_9cPslGLH6n3e5x6fV0m6OMLGhC45toEkcTVbL24mc%   
```

There are 3 tokens generated for three fictional users, and each user has a different set of roles. The actual token is 
the big long string of chars to the right of the ':'. The JWT is base 64 encoded (There are no white-spaces in the token
), so that t can be safely passed around on request (e.g. in an HTTP header). You can look at the contents of the any of 
the JWTs by pasting the corresponding token into the 'Encoded' text-box on the [JWT Debugger webpage](https://jwt.io/#debugger).
Note that you will see an "Invalid Signature" message on the bottom of the page. To address this, paste the contents of 
the `private.key` file (located in the project root) into the text box contain the message "your-256-bit-secret" and 
this warning will be resolved.

JWTs are frequently provided on the HTTP `Authorization` header like so:

```
curl http://localhost:3000/api/greeter/hello -H "Authorization: Bearer  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NSIsImlzcyI6InBldHN0b3JlLmNvbSIsIm5hbWUiOiJBbGljZSIsInJvbGVzIjpbIkFETUlOIiwiVVNFUiJdLCJpYXQiOjE2MTk2NDQzODQsImV4cCI6MTYyMDI0OTE4NH0.BzRKaR7NrocsY31lj6r0yy07Z3JDCc_0VoP9PsCm_qQ"
```
 
### Authentication

So, now that we have some JWTs, we can authenticate requests. As part of the specification, a JWT is signed with a 
private key when created. The signature is written to the end of the JWT. To verify the JWT, our API Gateway can 
essentially re-sign the JWT and compare the new signature with the original one at the bottom; if they match, then it
can be confident that this JWT was created by something possessing the secret key. You don't need to do all of this 
yourself, as we have provided the `jsonwebtoken` library to perform the verification. 

In the API Gateway service, add the following lines to the top of the script:

```javascript
const jwt = require("jsonwebtoken");
const privateKey = require("fs").readFileSync("private.key");
``` 

The value of the `authorization` header is already available for you in the `authenticate` method. Now you want to decode
the token using the `jwt` library and the `privateKey` value. Checck the jsonwebtoken [documentation](https://www.npmjs.com/package/jsonwebtoken) 
for an example of how to do this.

If you can successfully verify and decode the token, then you can take the data in the decoded token and return a user
object (this will be added to the Moleculer request context). Otherwise, you should probably throw an error, because 
token isn't valid.
