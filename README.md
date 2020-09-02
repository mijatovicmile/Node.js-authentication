## Getting Started

Install dependencies

```bash
yarn run
```

Run development server

```bash
yarn start
```

## Postman Test Environment

Body -> raw -> JSON

```bash
{
    "email": "your@email.com",
    "password": "yourpassword"
}
```

## APIs

Signup - POST method - localhost:3000/api/user/signup
Login - POST method - localhost:3000/api/user/login
Delete account - DELETE method - localhost:3000/api/user/delete/:userId
