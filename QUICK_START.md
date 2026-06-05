# ⚡ QUICK START GUIDE - Vehicle Chassis System

## 🚀 Start in 3 Steps

### Step 1: Start Backend (Terminal 1)
```bash
cd d:\ChasisNumber\Chasis-Number\chasis
mvn clean package
mvn spring-boot:run
```
✅ Wait for: `Tomcat started on port(s): 8081`

### Step 2: Start Frontend (Terminal 2)
```bash
cd d:\ChasisNumber\Chasis-Number\vehicle-frontend
npm run dev
```
✅ Wait for: `➜  Local:   http://localhost:5174/`

### Step 3: Open Browser
```
http://localhost:5174
```

---

## 🧑‍💼 Test Scenarios

### Scenario 1: Create New Account (Signup)
1. Click "Create one here" or go to `/signup`
2. Fill form:
   - **Username**: `john_doe`
   - **Email**: `john@company.com`
   - **Password**: `SecurePass123`
   - **GST Number**: `18AADCU1234B1Z0`
   - **Company**: `Acme Solutions`
3. Click **"Sign Up"** → Dashboard loads
4. See your details in "User Details Card"

### Scenario 2: Login with Demo Account
1. Go to `/login` (or click "Login here")
2. Use demo credentials:
   - **Username**: `testuser`
   - **Password**: `Test@123`
3. Click **"Sign In"** → Dashboard loads
4. See: "Welcome, testuser (USER)"

### Scenario 3: Search Vehicles (Any User)
1. On Dashboard, use **Search Panel**
2. Enter vehicle number or chassis number
3. See results in table
4. **Cannot delete** (USER role)

### Scenario 4: Add Vehicle (Admin Only)
1. Create new account OR promote to ADMIN (see below)
2. Click **"Add Vehicle (Admin)"** button
3. Fill:
   - Vehicle Number: `XYZ789`
   - Chassis Number: `MAT1AB9876543210`
4. Click **"Save Vehicle"** ✅
5. See success message

### Scenario 5: Delete Vehicle (Admin Only)
1. Login as ADMIN user
2. Go to **"View All Vehicles"**
3. See **Delete buttons** in table (right column)
4. Click Delete → Confirm popup
5. Vehicle deleted ✅

### Scenario 6: Logout
1. Click **"Logout"** button (top right)
2. Redirects to `/login`
3. Cannot access `/` (redirects to login)

---

## 🔑 How to Create Admin User

### Option 1: Database Query (Fastest)
```sql
-- Connect to PostgreSQL
UPDATE users SET role='ADMIN' WHERE username='testuser';
```

### Option 2: Edit & Recompile Java
In `AuthService.java`, change:
```java
.role(User.Role.ADMIN)  // Instead of User.Role.USER
```

---

## 🔒 Security Features Active

✅ JWT Token-based Auth  
✅ BCrypt Password Hashing  
✅ Role-Based Access Control (USER vs ADMIN)  
✅ 7-day Token Expiry  
✅ Auto-redirect on 401/403  
✅ CORS Whitelist  

---

## 📊 API Endpoints Reference

| Method | Path | Role | Status |
|--------|------|------|--------|
| POST | `/api/auth/signup` | Public | ✅ Working |
| POST | `/api/auth/login` | Public | ✅ Working |
| GET | `/api/master/search` | USER+ADMIN | ✅ Working |
| GET | `/api/master/all-paginated` | USER+ADMIN | ✅ Working |
| POST | `/api/master` | ADMIN | ✅ Working |
| POST | `/api/master/upload` | ADMIN | ✅ Working |
| DELETE | `/api/master/{id}` | ADMIN | ✅ Working |

---

## 🐛 Troubleshooting

### "Cannot connect to localhost:8081"
- Check backend console for errors
- Ensure `mvn spring-boot:run` is running
- Check if port 8081 is available: `netstat -ano | find ":8081"`

### "Axios not found" error
- Run: `cd vehicle-frontend && npm install`
- Restart `npm run dev`

### "Invalid username or password"
- Check PostgreSQL is running: `psql -U postgres`
- Verify user exists: `SELECT * FROM users;`
- Check password hasn't expired (JWT: 7 days)

### "Role not recognized"
- Ensure role is set to 'ADMIN' or 'USER'
- Check `UserRepository.findByUsername()` returns user

### "Cannot delete" (403 Forbidden)
- Login as ADMIN user
- Check: `SELECT * FROM users WHERE username='...';` → role='ADMIN'

---

## 📝 Key Files to Know

| File | Purpose |
|------|---------|
| `App.jsx` | Routes + AuthProvider wrapper |
| `AuthContext.jsx` | Global auth state |
| `vehicleApi.js` | API calls + token management |
| `axiosConfig.js` | JWT auto-injection + error handling |
| `ProtectedRoute.jsx` | Route guards by role |
| `SecurityConfig.java` | Spring Security bean |
| `AuthController.java` | /api/auth/* endpoints |
| `JwtTokenProvider.java` | JWT generation/validation |

---

## 🎯 What Works Now

✅ User Registration with Custom Fields (GST, Company)  
✅ JWT-based Login/Logout  
✅ Role-Based Access Control (USER vs ADMIN)  
✅ Protected Routes & API Endpoints  
✅ Delete Vehicles (Admin Only)  
✅ Search & View Vehicles (All Roles)  
✅ Upload Excel/PDF/Image Files (Admin Only)  
✅ Responsive UI with Error/Success Messages  
✅ Auto-redirect to Login on Session Expiry  

---

## ⏭️ What's Next (Optional)

- [ ] Email verification
- [ ] Password reset flow
- [ ] Admin dashboard for user management
- [ ] Token refresh endpoint
- [ ] Rate limiting / throttling
- [ ] Audit logging (who deleted what)
- [ ] Two-factor authentication
- [ ] Export data to Excel
- [ ] Edit vehicle records
- [ ] User profile page

---

## 📞 Common Commands

```bash
# Build backend
cd chasis && mvn clean package

# Run backend
mvn spring-boot:run

# Install frontend deps
cd vehicle-frontend && npm install

# Run frontend dev server
npm run dev

# Build frontend for production
npm run build

# Check if ports are available
netstat -ano | find ":8081"
netstat -ano | find ":5174"

# Connect to PostgreSQL
psql -U postgres -d chasisdb

# Query users table
SELECT id, username, email, role FROM users;
```

---

**Ready to test? Start the backend and frontend above! 🚀**
