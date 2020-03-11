# express-federation-response
express-federation-response is a response object created to standardize the response format of micro-services within a federation of services. This module requires a store.json file which is where all messages, directives and project scopes (form-fieds, supported-langs, error-states, etc) are stored. this file can be auto generated by notification-manager.

```js
const { response } = require('./express-federation-response')

app.use(response) // adds ctx to your req object. ctx contains a new response instance for each request.
```

## Example 1. Using EFR in your routes
```js
app.use((req, res) => {
    const { response } = req.ctx
    response
        .langTo('zh')
        .message('invalid_token')
        .message('authenticated_user', {username:'my-username'})
        .message('invalid_password')
        .payloadTo({first:'some-data', second:['some-more-data']})
        .statusTo(500)
        .send()
})
```
