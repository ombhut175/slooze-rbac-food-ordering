# Changelog

All notable changes to the Avengers DineOps project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Country selection during user signup
  - Users can now select their country (India or United States) during registration
  - Country selector component with flag emojis for better UX
  - Default country set to India (IN) if not specified
  - Backend validation for country field (accepts only 'IN' or 'US')
  - Comprehensive logging for country selection throughout signup flow
  - Updated API documentation to include country field in signup endpoint
  - Added feature documentation in `docs/FEATURES.md`

### Changed
- Updated SignupDto to accept optional country parameter
- Modified AuthService to use country from signup request instead of hardcoded default
- Enhanced signup page UI to include country selection between email and password fields
- Updated Swagger documentation with country field examples
- Improved structured logging to include country information

### Technical Details
- **Backend Changes:**
  - `backend/src/modules/auth/dto/signup.dto.ts` - Added country field with validation
  - `backend/src/modules/auth/auth.service.ts` - Uses country from signupDto
  - `backend/src/modules/auth/auth.controller.ts` - Updated Swagger docs
  
- **Frontend Changes:**
  - `frontend/src/app/(auth)/_components/country-select.tsx` - New component
  - `frontend/src/app/(auth)/signup/page.tsx` - Integrated CountrySelect
  - `frontend/src/hooks/use-auth-store.ts` - Accepts country parameter
  - `frontend/src/lib/api/auth.ts` - Updated SignupRequest interface

- **Documentation Updates:**
  - `backend/docs/auth-api-documentation.md` - Updated signup endpoint docs
  - `docs/ARCHITECTURE.md` - Added signup flow with country selection
  - `docs/QUICK_START.md` - Added signup testing instructions
  - `docs/FEATURES.md` - New comprehensive feature documentation
  - `README.md` - Added feature documentation link

## [1.0.0] - 2024-01-15

### Added
- Initial release of Avengers DineOps
- Role-Based Access Control (RBAC) with three roles: ADMIN, MANAGER, MEMBER
- Country-scoped data access (India and United States)
- Restaurant browsing and menu viewing
- Shopping cart with persistent state
- Order management system
- Mock payment processing
- User authentication with Supabase
- Comprehensive API documentation
- Test data seeding
- Responsive UI with dark mode support
- Structured logging system

### Backend Features
- NestJS framework with TypeScript
- PostgreSQL database with Drizzle ORM
- JWT-based authentication
- Role and country-based authorization guards
- RESTful API with Swagger documentation
- Comprehensive error handling
- Database migrations and seeding

### Frontend Features
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS with custom theme
- Shadcn/ui components
- Zustand for state management
- SWR for data fetching
- Framer Motion animations
- Responsive design

---

## Version History

- **[Unreleased]** - Country selection during signup
- **[1.0.0]** - 2024-01-15 - Initial release

---

## Links

- [Feature Documentation](./docs/FEATURES.md)
- [Architecture Documentation](./docs/ARCHITECTURE.md)
- [API Documentation](./backend/docs/RBAC_API.md)
- [Quick Start Guide](./docs/QUICK_START.md)
