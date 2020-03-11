# express-federation-response (EFR)
express-federation-response is a response object created to standardize the response format of micro-services within a federation of services. This module requires a store.json file which is where all messages, directives and project scopes (form-fieds, supported-langs, error-states, etc) are stored. this file can be auto generated by notification-manager.

```js
const { response } = require('./express-federation-response')

app.use(response) // adds ctx to your req object. ctx contains a new response instance for each request.
```

### example 1: Using EFR in your routes
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
The above code would yield the following response:
```js

{
    "id": 9570,
    "isFederationResponse": true,
    "status": 500,
    "lang": "zh",
    "payload": {
        "first": "some-data",
        "second": [
            "some-more-data"
            ]
    },
    "details": [
        {
            "code": "invalid_token",
            "status": 401,
            "state": "error",
            "key": "",
            "message": "token格式有误 - ER9570."
        },
        {
            "code": "authenticated_user",
            "status": 200,
            "state": "info",
            "key": "",
            "message": "欢迎回来my-username"
        },
        {
            "code": "invalid_password",
            "status": 422,
            "state": "validation",
            "key": "password",
            "message": "密码不对"
        }
    ],
    "directives": [],
    "created": "3/11/2020, 11:19:26 AM"
    }
```
