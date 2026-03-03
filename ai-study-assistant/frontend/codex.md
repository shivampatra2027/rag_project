---

## TASK AUTH — Google Login Frontend

Goal:
Allow users to sign in using Google account.

------------------------------------------------

1. Install

npm install @react-oauth/google

------------------------------------------------

2. Wrap App

In main.jsx:

<GoogleOAuthProvider clientId="YOUR_CLIENT_ID">
   <App />
</GoogleOAuthProvider>

------------------------------------------------

3. Create Page

src/pages/Login.jsx

Add GoogleLogin button.

------------------------------------------------

4. On Success

Receive credential response.

Send to backend:

POST /api/auth/google

Body:
{
  credential: response.credential
}

------------------------------------------------

5. Store Auth

Save:
- token
- user

inside authStore (zustand).

------------------------------------------------

6. Axios Update

Attach header automatically:

Authorization: Bearer <token>

------------------------------------------------

7. Redirect

After login → Home page.

------------------------------------------------

8. Protected App

If no token → show Login page.

Rules:
- Do not change existing pages
- Only add auth layer
- Return modified files only