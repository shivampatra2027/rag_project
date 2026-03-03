TASK: Automatically attach JWT token to API requests.

PROBLEM:
POST /api/upload returns 401 Unauthorized because Authorization header is missing.

GOAL:
Send JWT token with every backend request.

IMPLEMENT:

1. Create file:
src/lib/apiClient.js

2. Configure axios instance:

- baseURL = import.meta.env.VITE_API_URL
- Add request interceptor
- Read token from localStorage
- Attach header:

Authorization: Bearer <token>

Example logic:
const token = localStorage.getItem("token");
if(token){
  config.headers.Authorization = `Bearer ${token}`;
}

3. Replace all API calls with apiClient.

4. After Google login success:
store token:

localStorage.setItem("token", response.token);

EXPECTED RESULT:
- /api/upload returns 200 OK
- No Unauthorized errors