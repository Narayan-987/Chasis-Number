# 🔐 Spring Security Implementation Guide

## Phase 1 & 2 Complete ✅

### What Was Delivered

#### 📊 Architecture Analysis (Phase 1)
- ✅ Identified missing axios dependency
- ✅ Verified table column mapping (NO synchronization issues)
- ✅ Documented all 5 API endpoints
- ✅ Created dependency tree visualization

#### 🔒 Spring Security (Phase 2)
- ✅ JWT token-based authentication
- ✅ Role-based access control (USER, ADMIN)
- ✅ Custom user signup with gstNumber + companyName
- ✅ Delete endpoint (ADMIN only)

---

## 🎯 New Backend Files Created

### 1. User Entity
**File**: `chasis/src/main/java/com/vehicle/chasis/entity/User.java`
- Implements `UserDetails` interface
- **Custom fields**: gstNumber, companyName
- Role enum: USER or ADMIN
- BCrypt password hashing ready

### 2. User Repository
**File**: `chasis/src/main/java/com/vehicle/chasis/repository/UserRepository.java`
- Find users by username/email
- Check username/email uniqueness

### 3. DTOs
- **SignupRequest.java** - Registration with 5 fields (username, password, email, gstNumber, companyName)
- **LoginRequest.java** - 2 fields (username, password)
- **AuthResponse.java** - JWT token + user info returned after login/signup

### 4. Security Components
- **JwtTokenProvider.java** - Generate/validate HS256 tokens
- **JwtAuthenticationFilter.java** - Intercept requests, extract JWT from "Authorization: Bearer <token>"
- **SecurityConfig.java** - Configure role-based access rules
- **CustomUserDetailsService.java** - Load users from database

### 5. Auth Service & Controller
- **AuthService.java** - signup() & login() logic
- **AuthController.java** - POST /api/auth/signup & /api/auth/login

---

## 📝 Updated Files

### Backend Changes
1. **pom.xml** - Added 4 new dependencies:
   - spring-boot-starter-security
   - spring-security-crypto
   - jjwt (JWT library v0.12.3)

2. **VehicleMasterController.java**
   - Added DELETE /{id} endpoint
   - Fixed @CrossOrigin to specific hosts

3. **VehicleMasterService.java**
   - Added deleteVehicle(Long id) method

4. **application.properties**
   - JWT secret & expiration (7 days)
   - Security logging enabled

### Frontend Changes
1. **package.json** - Added axios ^1.6.0
2. **axiosConfig.js**
   - Fixed baseURL to 8081
   - Auto-inject JWT in headers
   - Handle 401/403 (redirect to login)
3. **vehicleApi.js**
   - signup(signupData)
   - login(credentials)
   - setToken/getToken/logout/isAuthenticated
   - setUserInfo/getUserInfo
   - deleteVehicle(id)

---

## 🚀 API Endpoints

### Authentication (Public)
```
POST /api/auth/signup
Content-Type: application/json

{
  "username": "john_doe",
  "password": "SecurePassword123",
  "email": "john@company.com",
  "gstNumber": "18AADCU1234B1Z0",
  "companyName": "Acme Corp"
}

Response (201 Created):
{
  "token": "eyJhbGc...",
  "type": "Bearer",
  "id": 1,
  "username": "john_doe",
  "email": "john@company.com",
  "role": "USER",
  "gstNumber": "18AADCU1234B1Z0",
  "companyName": "Acme Corp"
}
```

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "SecurePassword123"
}

Response (200 OK):
{
  "token": "eyJhbGc...",
  "type": "Bearer",
  ...
}
```

### Vehicle Data (Requires JWT)
```
GET /api/master/search?vehicleNo=ABC123&page=0
Authorization: Bearer <token>
→ 200 OK (USER or ADMIN)

POST /api/master
Authorization: Bearer <token>
→ 201 Created (ADMIN only) | 403 Forbidden (USER)

DELETE /api/master/1
Authorization: Bearer <token>
→ 200 OK (ADMIN only) | 403 Forbidden (USER)
```

---

## 🧪 Testing the Implementation

### Step 1: Install Frontend Dependencies
```bash
cd vehicle-frontend
npm install
```

### Step 2: Build Backend
```bash
cd chasis
mvn clean package
```

### Step 3: Start Backend
```bash
mvn spring-boot:run
```
Server will run on http://localhost:8081

### Step 4: Test Signup
```bash
curl -X POST http://localhost:8081/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "Test@123",
    "email": "test@example.com",
    "gstNumber": "18AADCU1234B1Z0",
    "companyName": "Test Company"
  }'
```

### Step 5: Test Login
```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "Test@123"
  }'
```

### Step 6: Test Protected Endpoint
```bash
curl -X GET http://localhost:8081/api/master/search?vehicleNo=ABC \
  -H "Authorization: Bearer <your-token-from-login>"
```

---

## 📱 Frontend Integration Points

### Using Auth Functions in React
```jsx
import { signup, login, setToken, setUserInfo } from "./api/vehicleApi";

// Signup
const handleSignup = async (formData) => {
  try {
    const response = await signup(formData);
    setToken(response.data.token);
    setUserInfo(response.data);
    navigate("/dashboard");
  } catch (error) {
    console.error(error.response.data.message);
  }
};

// Login
const handleLogin = async (credentials) => {
  try {
    const response = await login(credentials);
    setToken(response.data.token);
    setUserInfo(response.data);
    navigate("/dashboard");
  } catch (error) {
    console.error("Invalid credentials");
  }
};

// Check if admin
const isAdmin = localStorage.getItem("userRole") === "ADMIN";
```

---

## 🔐 Security Features

✅ **Password Hashing** - BCryptPasswordEncoder
✅ **JWT Tokens** - HS256 algorithm, 7-day expiry
✅ **CORS** - Whitelist localhost:5174 & 3000
✅ **Role-Based Access** - GET (USER+ADMIN), POST/DELETE (ADMIN)
✅ **Auto Token Injection** - Axios interceptor adds "Authorization" header
✅ **Token Refresh** - 401 response clears token & redirects to login
✅ **CSRF Protection** - Disabled for stateless API

---

## ⚠️ Still TODO (Optional)

1. **Frontend Pages** - Create signup/login components
2. **Protected Routes** - Route guards with role checks
3. **User Profile** - Display user info (gstNumber, companyName)
4. **Cascading Date Filter** - Year → Month dependency
5. **Edit User** - PUT /api/users/{id}
6. **Admin Dashboard** - User management panel
7. **Token Refresh** - Implement refresh tokens
8. **Audit Logging** - Track who deleted what vehicle

---

## 📚 Configuration Reference

### JWT Settings (application.properties)
```properties
app.jwtSecret=secretKeyForChasisNumberSystemThatIsLongEnoughForHS256AlgorithmForJWT
app.jwtExpirationMs=604800000  # 7 days in milliseconds
```

### CORS Allowed Origins
```java
http://localhost:5174  # Vite dev server
http://localhost:3000  # React alternative
```

### Database (Auto-created)
```sql
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  gst_number VARCHAR(255) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL,
  enabled BOOLEAN DEFAULT true
);
```

---

## 🎓 Next Phase: Frontend Pages

Ready to create signup/login pages when you give the signal!

Components needed:
- SignupPage.jsx
- LoginPage.jsx
- ProtectedRoute.jsx (guards routes by role)
- AuthContext.jsx (share auth state)
