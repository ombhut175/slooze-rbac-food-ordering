# 🚀 Avengers DineOps - Quick Start Guide

Get the application running in 5 minutes!

## ⚡ Prerequisites Check

Before starting, ensure you have:

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm 9+ installed (`npm --version`)
- [ ] PostgreSQL 14+ running
- [ ] Supabase account created
- [ ] Git installed

## 📥 Step 1: Clone & Install (2 minutes)

```bash
# Clone repository
git clone <repository-url>
cd avengers-dineops

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## ⚙️ Step 2: Configure Environment (1 minute)

### Backend Configuration

```bash
cd backend

# Copy environment template
cp env.example.txt .env.local

# Edit .env.local with your values:
# - SUPABASE_URL=https://your-project.supabase.co
# - SUPABASE_ANON_KEY=your-anon-key
# - SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
# - DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

### Frontend Configuration

```bash
cd ../frontend

# Copy environment template
cp .env.example .env.local

# Edit .env.local:
# - NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🗄️ Step 3: Setup Database (1 minute)

```bash
cd backend

# Generate migrations
npm run db:generate

# Apply migrations
npm run db:migrate

# Seed test data
npm run db:seed
```

**Expected Output:**
```
✅ Database seeding completed successfully!

=== Test Accounts ===
All accounts use password: Password123!

Nick                 | nick@example.com                    | ADMIN      | IN
Captain Marvel       | captain.marvel@example.com          | MANAGER    | IN
Captain America      | captain.america@example.com         | MANAGER    | US
Thanos               | thanos@example.com                  | MEMBER     | IN
Thor                 | thor@example.com                    | MEMBER     | IN
Travis               | travis@example.com                  | MEMBER     | US
```

## 🎬 Step 4: Start Servers (1 minute)

### Terminal 1 - Backend

```bash
cd backend
npm run start:dev
```

**Expected Output:**
```
[Nest] Application successfully started
[Nest] Listening on http://localhost:3000
```

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

**Expected Output:**
```
▲ Next.js 16.0.2
- Local:        http://localhost:5321
- Ready in 2.3s
```

## ✅ Step 5: Verify Installation

### 1. Check Backend Health

```bash
curl http://localhost:3000/health
```

**Expected Response:**
```json
{"status":"ok","timestamp":"2024-01-15T10:00:00.000Z"}
```

### 2. Open Frontend

Navigate to: http://localhost:5321

You should see the login page.

### 3. Test Login

**Credentials:**
- Email: `nick@example.com`
- Password: `Password123!`

After login, you should be redirected to the dashboard.

### 3a. Test Signup (Optional)

You can also test the signup flow:

1. Click "Sign up" on the login page
2. Fill in the form:
   - Name: Your name
   - Email: A new email address
   - **Country: Select India (IN) or United States (US)**
   - Password: At least 8 characters
   - Confirm Password: Same as password
3. Click "Create account"
4. You'll be redirected to login (email confirmation required)

### 4. View API Documentation

Navigate to: http://localhost:3000/api/docs

You should see the Swagger UI with all API endpoints.

## 🎯 What's Next?

### Explore the Application

1. **Sign Up** - Create a new account and select your country (IN or US)
2. **Browse Restaurants** - View restaurants filtered by your country
3. **View Menu** - Click on a restaurant to see menu items
4. **Add to Cart** - Add items to your shopping cart
5. **Create Order** - Cart creates a draft order automatically
6. **Checkout** - Complete order (ADMIN/MANAGER only)
7. **View Orders** - See your order history

### Test Different Roles

Login with different accounts to see role-based access:

**ADMIN (Full Access):**
- Email: `nick@example.com`
- Can manage users, payment methods, checkout orders
- Sees data from all countries

**MANAGER (Checkout Access):**
- Email: `captain.america@example.com` (US)
- Email: `captain.marvel@example.com` (IN)
- Can checkout and cancel orders
- Sees only their country's data

**MEMBER (Browse Only):**
- Email: `travis@example.com` (US)
- Email: `thanos@example.com` (IN)
- Can browse and add to cart
- Cannot checkout orders
- Sees only their country's data

### Test API with Postman

1. Open Postman
2. Import `backend/docs/postman_collection.json`
3. Run "Login - Admin" request
4. Token will be saved automatically
5. Test other endpoints

## 📚 Documentation

### Essential Reading

1. **[README.md](../README.md)** - Project overview
2. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture
3. **[backend/README.md](../backend/README.md)** - Backend documentation
4. **[frontend/README.md](../frontend/README.md)** - Frontend documentation
5. **[frontend/docs/rules.md](../frontend/docs/rules.md)** - Development rules

### API Documentation

- **[backend/docs/RBAC_API.md](../backend/docs/RBAC_API.md)** - Complete API reference
- **[backend/docs/DATASETS.md](../backend/docs/DATASETS.md)** - Test data documentation
- **http://localhost:3000/api/docs** - Interactive Swagger UI

### Testing Resources

- **[backend/docs/postman_collection.json](../backend/docs/postman_collection.json)** - Postman collection
- **[backend/docs/DATASETS.md](../backend/docs/DATASETS.md)** - Test accounts and data

## 🐛 Troubleshooting

### Backend Won't Start

**Problem:** Port 3000 already in use

**Solution:**
```bash
# Change port in backend/.env.local
PORT=3001

# Or kill process using port 3000
# Windows: netstat -ano | findstr :3000
# Mac/Linux: lsof -ti:3000 | xargs kill -9
```

### Database Connection Failed

**Problem:** Cannot connect to PostgreSQL

**Solution:**
1. Verify PostgreSQL is running: `pg_isready`
2. Check DATABASE_URL in .env.local
3. Ensure database exists: `createdb your_database_name`
4. Check PostgreSQL logs for errors

### Supabase Auth Failed

**Problem:** Token validation fails

**Solution:**
1. Verify Supabase project is active
2. Check SUPABASE_URL and keys in .env.local
3. Ensure service role key has admin permissions
4. Test connection in Supabase dashboard

### Frontend Won't Start

**Problem:** Port 5321 already in use

**Solution:**
```bash
# Use different port
npm run dev -- -p 3001
```

### Migration Failed

**Problem:** Database migration errors

**Solution:**
```bash
# Delete migrations and regenerate
rm -rf drizzle/
npm run db:generate
npm run db:migrate
```

### Seed Script Failed

**Problem:** Seed script errors

**Solution:**
1. Ensure migrations are applied: `npm run db:migrate`
2. Check Supabase service role key permissions
3. Verify DATABASE_URL is correct
4. Check for existing data conflicts

## 💡 Tips

### Development Workflow

1. **Backend Changes:**
   - Edit code in `backend/src/`
   - Server auto-restarts (watch mode)
   - Check terminal for errors

2. **Frontend Changes:**
   - Edit code in `frontend/src/`
   - Page auto-refreshes (hot reload)
   - Check browser console for errors

3. **Database Changes:**
   - Edit schema in `backend/src/core/database/schema/`
   - Run `npm run db:generate` to create migration
   - Run `npm run db:migrate` to apply migration

### Useful Commands

```bash
# Backend
cd backend
npm run validate        # Type-check + lint
npm run db:studio       # Open Drizzle Studio
npm test                # Run tests

# Frontend
cd frontend
npm run validate        # Type-check + lint
npm run build           # Production build
```

### Debugging

1. **Backend Logs:** Check terminal running `npm run start:dev`
2. **Frontend Logs:** Check browser console (F12)
3. **Database:** Use Drizzle Studio (`npm run db:studio`)
4. **API:** Use Swagger UI (http://localhost:3000/api/docs)
5. **Network:** Check browser Network tab (F12)

## 🎓 Learning Path

### Day 1: Setup & Basics
1. Complete this quick start guide
2. Read [README.md](../README.md)
3. Explore the application with different roles
4. Test API with Postman

### Day 2: Architecture
1. Read [ARCHITECTURE.md](./ARCHITECTURE.md)
2. Understand data flow
3. Review security architecture
4. Study database design

### Day 3: Backend
1. Read [backend/README.md](../backend/README.md)
2. Review [backend/docs/RBAC_API.md](../backend/docs/RBAC_API.md)
3. Explore backend code structure
4. Test API endpoints

### Day 4: Frontend
1. Read [frontend/README.md](../frontend/README.md)
2. Review [frontend/docs/rules.md](../frontend/docs/rules.md)
3. Explore frontend code structure
4. Understand state management

### Day 5: Development
1. Make a small change
2. Follow development rules
3. Test your changes
4. Run validation commands

## 🤝 Getting Help

### Documentation
- Check README files in each directory
- Review architecture documentation
- Read API documentation
- Check troubleshooting sections

### Common Issues
- Port conflicts: Change ports in .env files
- Database errors: Check PostgreSQL logs
- Auth errors: Verify Supabase credentials
- Build errors: Run `npm install` again

### Community
- Create GitHub issue for bugs
- Check existing issues for solutions
- Review pull requests for examples

## ✅ Success Checklist

- [ ] Backend running on http://localhost:3000
- [ ] Frontend running on http://localhost:5321
- [ ] Can login with test account
- [ ] Can browse restaurants
- [ ] Can add items to cart
- [ ] Can view orders
- [ ] Swagger UI accessible
- [ ] Postman collection imported
- [ ] Database seeded with test data

**Congratulations! You're ready to start developing! 🎉**

---

**Need Help?** Check the [Troubleshooting](#troubleshooting) section or review the [Documentation](#documentation).
