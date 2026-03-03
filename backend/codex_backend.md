---

## TASK AUTH — Google Authentication

Goal:
Authenticate users using Google OAuth instead of email/password.

------------------------------------------------

1. Install dependencies

npm install google-auth-library jsonwebtoken mongoose

------------------------------------------------

2. ENV VARIABLES

Add to .env:

GOOGLE_CLIENT_ID=your_google_client_id
JWT_SECRET=your_secret

------------------------------------------------

3. User Model (reuse existing)

fields:
- name
- email (unique)
- googleId
- createdAt

(No password field needed.)

------------------------------------------------

4. Create Route

routes/auth.js

POST /api/auth/google

Input:
{
  "credential": "<google_id_token>"
}

------------------------------------------------

5. Verify Google Token

Use google-auth-library:

- verify credential using GOOGLE_CLIENT_ID
- extract:
   email
   name
   sub (google user id)

------------------------------------------------

6. User Handling

- find user by email
- if not exists → create user
- store googleId

------------------------------------------------

7. Generate JWT

payload:
{
  userId: user._id
}

expiry: 7d

------------------------------------------------

8. Response

{
  token,
  user: {
    id,
    name,
    email
  }
}

------------------------------------------------

9. Auth Middleware

Keep existing JWT middleware.

req.userId = decoded.userId

------------------------------------------------

10. Remove password auth routes (optional).

Rules:
- Keep existing APIs working
- Minimal changes
- Return modified files only