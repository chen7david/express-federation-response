# express-federation-response (EFR)
express-federation-response is a response object created to standardize the response format of micro-services within a federation of services. This module requires a store.json file which is where all messages, directives and project scopes (form-fields, supported-langs, error-states, etc) are stored. this file can be auto-generated by notification-manager. **NOTE:** this module relies on the store.json file for data, it is the only required argument.

```js
// setting up express
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const port = 9000

// setting up express-federation-response

const { response } = require('express-federation-response') // include the module from your packages

const storefile = require('./store.json') // imports the store.js from your file system

app.use(response(storefile)) // adds ctx to your req object. A new response instance is created on each request.

// routes go here ...

server.listen(port, () => {
    console.log(`server running at http://localhost:${port}`)
})
```

### example 1: EFR usage in routes
```js
app.use((req, res) => {
    const { response } = req.ctx
    response
        .langTo('zh') // sets the response language to chinese, if this function is not called it will default to english.
        .message('invalid_token') // adds a message detail to the response.
        .message('authenticated_user', {username:'my-username'}) // adds a message template detail to the response as the first argument, and data as the second.
        .message('invalid_password')
        .payloadTo({first:'some-data', second:['some-more-data']}) // adds a payload to the response
        .statusTo(500) // sets the response status to 500, if this function is not called it will detault to the status of the first message in the reponse details. if no messages were set it will be 200. 
        .send() // is the same as calling res.status(200).json(Response)
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
