## Installation
### Manual Install
- `npm install`
- copy `env` to `.env`, leave `MONGO_USER` and `MONGO_PASS` blank if not using URI without username & password like in localhost
- `npm start`

### Docker
- Run `docker-compose up`

## Tests
- Run `npm test`

## Guide
#### Endpoints
- [POST] `/api/auth/register`
```
{
  "username": "user",
  "email": "user@email.com",
  "password": "passW0RD@",
  "firstName": "Us",
  "lastName": "Er"
}
```

- [POST] `/api/auth/login`
```
{
  "email": "user@email.com",
  "password": "passW0RD@"
}
```

- [POST] `/api/auth/logout`
```
{
  "refreshToken": <your token>
}
```

- [GET] `/api/auth/refresh?refreshToken=<your refresh token>`


#### API

Every endpoints need to auth before used, `accesToken` only valid every 15 minutes and need to refresh token using `accessToken` who was provided in `auth/login`. Please always save the `refreshToken` becuase you can't login if the user have active the session (not logout). If in case you lost the `refreshToken`, remove user session from `usertokens` collection in database manualy.

Header:
`Authorization: Bearer <your token>`

- Fetch All Board data 
[GET] `/api/board`
- Create new Board
[POST] `/api/board/`
```
{
    "name": "asd",
    "description": "Test"
}
```
- Update Board
[PUT] `/api/board/?name=asd`
```
{
    "name": "dsa",
    "description": "wkwk"
}
```
- Share Board to other user
[POST] `/api/board/share?name=asd`
```
{
    "username": "asd",
    "role": "guest"
}
```
- Delete Board
[DELETE] `/api/board/?name=asd`



- Column Create
[POST] `/api/column/`
```
{
    "board": "asd",
    "column": "To Do"
}
```
- Column Update
[PUT] `/api/column/?board=asd&column=To Do 2`
```
{
    "column": "To Do 2",
    "position": 4
}
```
- Column Delete
[DELETE] `/api/column/?board=asd&column=To Do 1`


- Task Create
[POST] `/api/task/`
```
{
    "board": "asd",
    "column": "To Do",
    "task": "baz"
}
```
- Task Update
[PUT] `/api/task/?board=asd&column=To Do&task=baz`
```
{
    "column": "To Do 2",
    "task": "baz"
}
```
- Task Delete
[DELETE] `/api/task?board=asd&column=To Do&task=baz`

### Code Docs
#### Response Result
- Make the API response more simpe using utils `responseResult` function.
```
responseResult(res, {
  code: 200,
  data: {
    // you obj data
  },
  message: "Here yor message",
})
```