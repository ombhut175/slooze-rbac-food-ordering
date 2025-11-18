# 📚 Avengers DineOps - Documentation Index

Welcome to the Avengers DineOps documentation! This directory contains comprehensive guides and references for the entire project.

## 📖 Documentation Structure

```
avengers-dineops/
├── README.md                          # Main project overview
├── docs/                              # Project-wide documentation
│   ├── README.md                      # This file
│   ├── QUICK_START.md                 # 5-minute setup guide
│   └── ARCHITECTURE.md                # System architecture & design
│
├── backend/
│   ├── README.md                      # Backend documentation
│   └── docs/                          # Backend-specific docs
│       ├── RBAC_API.md                # Complete API reference
│       ├── DATASETS.md                # Test data & seed info
│       ├── postman_collection.json    # Postman API collection
│       ├── auth-api-documentation.md  # Auth API details
│       ├── drizzle-setup.md           # Database setup
│       └── rules.md                   # Backend coding rules
│
└── frontend/
    ├── README.md                      # Frontend documentation
    └── docs/
        └── rules.md                   # Frontend coding rules (MANDATORY)
```

## 🎯 Quick Navigation

### Getting Started
- **New to the project?** → [QUICK_START.md](./QUICK_START.md)
- **Want to understand the system?** → [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Need project overview?** → [Root README](../README.md)

### Development
- **Backend development** → [backend/README.md](../backend/README.md)
- **Frontend development** → [frontend/README.md](../frontend/README.md)
- **Frontend coding rules** → [frontend/docs/rules.md](../frontend/docs/rules.md) ⚠️ MANDATORY
- **Backend coding rules** → [backend/docs/rules.md](../backend/docs/rules.md)

### API & Testing
- **API reference** → [backend/docs/RBAC_API.md](../backend/docs/RBAC_API.md)
- **Test data** → [backend/docs/DATASETS.md](../backend/docs/DATASETS.md)
- **Postman collection** → [backend/docs/postman_collection.json](../backend/docs/postman_collection.json)
- **Interactive API docs** → http://localhost:3000/api/docs (when running)

## 📋 Documentation by Role

### For New Developers

1. **[QUICK_START.md](./QUICK_START.md)** - Get the app running in 5 minutes
2. **[Root README](../README.md)** - Understand the project overview
3. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Learn the system design
4. **[backend/README.md](../backend/README.md)** - Backend setup and structure
5. **[frontend/README.md](../frontend/README.md)** - Frontend setup and structure
6. **[frontend/docs/rules.md](../frontend/docs/rules.md)** - Mandatory coding standards

### For API Developers

1. **[backend/docs/RBAC_API.md](../backend/docs/RBAC_API.md)** - Complete API reference
2. **[backend/docs/DATASETS.md](../backend/docs/DATASETS.md)** - Test accounts and data
3. **[backend/docs/postman_collection.json](../backend/docs/postman_collection.json)** - Import into Postman
4. **http://localhost:3000/api/docs** - Interactive Swagger UI

### For Frontend Developers

1. **[frontend/README.md](../frontend/README.md)** - Frontend architecture
2. **[frontend/docs/rules.md](../frontend/docs/rules.md)** - Mandatory development rules
3. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Frontend architecture section
4. **[backend/docs/RBAC_API.md](../backend/docs/RBAC_API.md)** - API endpoints to integrate

### For Backend Developers

1. **[backend/README.md](../backend/README.md)** - Backend setup and structure
2. **[backend/docs/rules.md](../backend/docs/rules.md)** - Backend coding standards
3. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Backend architecture section
4. **[backend/docs/DATASETS.md](../backend/docs/DATASETS.md)** - Database and seed data

### For Testers

1. **[backend/docs/DATASETS.md](../backend/docs/DATASETS.md)** - Test accounts and data
2. **[backend/docs/postman_collection.json](../backend/docs/postman_collection.json)** - API testing
3. **[backend/docs/RBAC_API.md](../backend/docs/RBAC_API.md)** - Expected API behaviors
4. **[QUICK_START.md](./QUICK_START.md)** - Setup for testing

## 📚 Document Descriptions

### Project-Wide Documentation

#### [QUICK_START.md](./QUICK_START.md)
**5-minute setup guide**
- Prerequisites checklist
- Step-by-step installation
- Environment configuration
- Database setup and seeding
- Server startup
- Verification steps
- Troubleshooting
- Learning path

#### [ARCHITECTURE.md](./ARCHITECTURE.md)
**System architecture and design patterns**
- High-level architecture diagrams
- Architecture patterns (layered, repository, guard, DTO)
- Technology stack breakdown
- System components
- Data flow diagrams
- Security architecture
- Database design with ER diagrams
- API design principles
- Frontend architecture
- Design decisions
- Scalability considerations

### Backend Documentation

#### [backend/README.md](../backend/README.md)
**Backend setup and development**
- Overview and features
- Technology stack
- Quick start guide
- Configuration
- Database setup
- API endpoints overview
- Testing guide
- Code quality tools
- Project structure
- Development workflow
- Troubleshooting

#### [backend/docs/RBAC_API.md](../backend/docs/RBAC_API.md)
**Complete API reference**
- All API endpoints
- Request/response examples
- Authentication requirements
- Role-based access control rules
- Error handling
- Complete cURL examples
- Testing workflows

#### [backend/docs/DATASETS.md](../backend/docs/DATASETS.md)
**Test data and seed information**
- Test user accounts (6 users)
- User roles and permissions
- Restaurants and menus (6 restaurants, 42 items)
- Payment methods (2 mock methods)
- Data relationships
- Seeding instructions
- Verification steps

#### [backend/docs/postman_collection.json](../backend/docs/postman_collection.json)
**Postman API collection**
- All API endpoints organized
- Pre-configured authentication
- Automatic token management
- Example requests for all roles
- Auto-save response variables

### Frontend Documentation

#### [frontend/README.md](../frontend/README.md)
**Frontend architecture and development**
- Overview and features
- Technology stack
- Architecture diagrams
- Quick start guide
- Project structure
- Development guidelines
- Components documentation
- Hooks documentation
- State management
- API integration
- Styling guide
- Testing guide

#### [frontend/docs/rules.md](../frontend/docs/rules.md)
**Mandatory development rules** ⚠️
- Custom logger usage (hackLog)
- API call patterns (helpers/request.ts)
- Error handling (helpers/errors.ts)
- Constants management
- Folder structure
- Code organization
- Logging requirements
- Development workflow

## 🔍 Finding Information

### By Topic

**Authentication & Authorization:**
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Security architecture section
- [backend/docs/RBAC_API.md](../backend/docs/RBAC_API.md) - Auth endpoints
- [backend/docs/auth-api-documentation.md](../backend/docs/auth-api-documentation.md)

**Database:**
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Database design section
- [backend/docs/DATASETS.md](../backend/docs/DATASETS.md) - Test data
- [backend/docs/drizzle-setup.md](../backend/docs/drizzle-setup.md) - ORM setup

**API Integration:**
- [backend/docs/RBAC_API.md](../backend/docs/RBAC_API.md) - API reference
- [backend/docs/postman_collection.json](../backend/docs/postman_collection.json) - Testing
- [frontend/docs/rules.md](../frontend/docs/rules.md) - API call patterns

**Testing:**
- [backend/docs/DATASETS.md](../backend/docs/DATASETS.md) - Test accounts
- [backend/docs/postman_collection.json](../backend/docs/postman_collection.json) - API testing
- [backend/README.md](../backend/README.md) - Testing section

**Development Workflow:**
- [QUICK_START.md](./QUICK_START.md) - Initial setup
- [frontend/docs/rules.md](../frontend/docs/rules.md) - Frontend rules
- [backend/docs/rules.md](../backend/docs/rules.md) - Backend rules

## 🆘 Getting Help

### Documentation Issues
- Check the relevant README file first
- Review the architecture documentation
- Look for troubleshooting sections
- Check related documentation links

### Common Questions

**"How do I get started?"**
→ [QUICK_START.md](./QUICK_START.md)

**"How does the system work?"**
→ [ARCHITECTURE.md](./ARCHITECTURE.md)

**"What are the API endpoints?"**
→ [backend/docs/RBAC_API.md](../backend/docs/RBAC_API.md)

**"What are the test accounts?"**
→ [backend/docs/DATASETS.md](../backend/docs/DATASETS.md)

**"What are the coding rules?"**
→ [frontend/docs/rules.md](../frontend/docs/rules.md) (Frontend)
→ [backend/docs/rules.md](../backend/docs/rules.md) (Backend)

**"How do I test the API?"**
→ [backend/docs/postman_collection.json](../backend/docs/postman_collection.json)

## 📝 Contributing to Documentation

When updating documentation:

1. **Keep it current** - Update docs when code changes
2. **Be clear** - Use simple language and examples
3. **Add diagrams** - Visual aids help understanding
4. **Cross-reference** - Link to related documentation
5. **Test examples** - Ensure code examples work
6. **Update index** - Update this file when adding new docs

## 🔗 External Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Supabase Documentation](https://supabase.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Last Updated:** 2024-01-15  
**Documentation Version:** 1.0.0
