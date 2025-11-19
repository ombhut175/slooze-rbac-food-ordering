# 🎯 Avengers DineOps - Feature Documentation

This document describes key features and their implementation details.

## 📋 Table of Contents

- [Country Selection During Signup](#country-selection-during-signup)
- [Role-Based Access Control](#role-based-access-control)
- [Country-Scoped Data Access](#country-scoped-data-access)

---

## 🌍 Country Selection During Signup

### Overview

Users can select their country (India or United States) during the signup process. This country assignment determines which restaurants and content they can access throughout the application.

### User Experience

**Signup Flow:**
1. User navigates to the signup page
2. User fills in:
   - Full name
   - Email address
   - **Country selection (India 🇮🇳 or United States 🇺🇸)**
   - Password
   - Password confirmation
3. User agrees to Terms and Privacy Policy
4. User clicks "Create account"
5. Account is created with the selected country
6. User is redirected to login page

**Visual Design:**
- Country selector appears between email and password fields
- Dropdown shows country flags and names for easy identification
- Default selection is India (IN)
- Animated focus effects match other form inputs
- Validation ensures a valid country is selected

### Technical Implementation

#### Backend

**SignupDto (backend/src/modules/auth/dto/signup.dto.ts):**
```typescript
export class SignupDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string;

  @IsOptional()
  @IsEnum(['IN', 'US'])
  country?: 'IN' | 'US';  // Optional, defaults to 'IN'
}
```

**AuthService (backend/src/modules/auth/auth.service.ts):**
```typescript
async signup(signupDto: SignupDto) {
  // Use provided country or default to 'IN'
  const country = signupDto.country || 'IN';

  // Create user in Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email: signupDto.email,
    password: signupDto.password,
  });

  // Create public user record with country
  const publicUser = await this.usersRepository.create({
    id: data.user.id,
    email: signupDto.email,
    country: country,  // Store selected country
    isEmailVerified: false,
  });

  return { user: data.user, publicUser };
}
```

**Database Schema:**
```typescript
// users table
{
  id: uuid (primary key),
  email: varchar(255),
  role: enum('ADMIN', 'MANAGER', 'MEMBER'),
  country: enum('IN', 'US'),  // User's country
  is_email_verified: boolean,
  created_at: timestamp,
  updated_at: timestamp
}
```

#### Frontend

**CountrySelect Component (frontend/src/app/(auth)/_components/country-select.tsx):**
```typescript
const COUNTRY_OPTIONS = [
  { value: "IN", label: "India", flag: "🇮🇳" },
  { value: "US", label: "United States", flag: "🇺🇸" },
];

export function CountrySelect({ value, onChange, error }) {
  return (
    <Field label="Select your country" error={error}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue>
            {value && (
              <span>
                {COUNTRY_OPTIONS.find(c => c.value === value)?.flag}
                {COUNTRY_OPTIONS.find(c => c.value === value)?.label}
              </span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {COUNTRY_OPTIONS.map(country => (
            <SelectItem key={country.value} value={country.value}>
              <span>{country.flag} {country.label}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}
```

**SignupPage Integration:**
```typescript
export default function SignupPage() {
  const [country, setCountry] = useState<string>("IN");

  async function onSubmit(event) {
    // ... form validation

    // Include country in signup request
    const success = await signup({ 
      email, 
      password, 
      country: country as 'IN' | 'US' 
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <Field label="Email">
        <Input name="email" type="email" />
      </Field>

      <CountrySelect 
        value={country}
        onChange={setCountry}
        error={errors?.country}
      />

      <Field label="Password">
        <PasswordInput name="password" />
      </Field>

      {/* ... other fields */}
    </form>
  );
}
```

### Validation

**Frontend Validation:**
- Country must be selected (required field)
- Country must be either 'IN' or 'US'
- Validation error shown if invalid

**Backend Validation:**
- `@IsOptional()` - Country is optional (defaults to 'IN')
- `@IsEnum(['IN', 'US'])` - Only accepts 'IN' or 'US'
- Returns 400 Bad Request if invalid country provided

### Logging

**Structured Logging:**
```typescript
// Signup attempt
hackLog.storeAction('signup-start', {
  email: data.email,
  country: data.country || 'IN',
  trigger: 'user_action'
});

// Signup success
hackLog.storeAction('signup-success', {
  userId: response.user.id,
  email: response.user.email,
  country: response.publicUser?.country,
  isEmailVerified: response.isEmailVerified
});

// Backend logging
this.logger.log('User signup attempt', {
  operation: 'signup',
  email: signupDto.email,
  country: country,
  timestamp: new Date().toISOString(),
});
```

### API Documentation

**Swagger/OpenAPI:**
```yaml
/auth/signup:
  post:
    summary: User Registration
    requestBody:
      content:
        application/json:
          schema:
            type: object
            required:
              - email
              - password
            properties:
              email:
                type: string
                format: email
                example: jane.smith@example.com
              password:
                type: string
                minLength: 8
                example: MySecurePassword123!
              country:
                type: string
                enum: [IN, US]
                default: IN
                example: US
                description: User's country code
```

### Impact on User Experience

**Country-Based Features:**

1. **Restaurant Filtering:**
   - Users see only restaurants from their country
   - India users see Indian restaurants
   - US users see US restaurants
   - Admins see all restaurants

2. **Order Management:**
   - Orders are automatically tagged with user's country
   - Users can only view orders from their country
   - Admins can view orders from all countries

3. **Data Isolation:**
   - Country acts as a data partition
   - Ensures users only access relevant content
   - Improves performance by reducing data volume

### Testing

**Test Scenarios:**

1. **Signup with India:**
   - Select India from dropdown
   - Complete signup
   - Verify user.country = 'IN' in database
   - Login and verify only Indian restaurants visible

2. **Signup with United States:**
   - Select United States from dropdown
   - Complete signup
   - Verify user.country = 'US' in database
   - Login and verify only US restaurants visible

3. **Signup without country (default):**
   - Don't select country (or API call without country field)
   - Complete signup
   - Verify user.country = 'IN' (default)

4. **Invalid country validation:**
   - Try to submit with invalid country code
   - Verify frontend validation error
   - Try API call with invalid country
   - Verify 400 Bad Request response

### Future Enhancements

**Potential Improvements:**

1. **More Countries:**
   - Add support for additional countries
   - Update enum in database and DTOs
   - Add country options to dropdown

2. **Country Change:**
   - Allow users to change country (with admin approval)
   - Add endpoint: `PATCH /users/:id/country`
   - Implement country change workflow

3. **Geolocation:**
   - Auto-detect user's country from IP address
   - Pre-select country in dropdown
   - Allow user to override if needed

4. **Country-Specific Features:**
   - Different payment methods per country
   - Country-specific promotions
   - Localized content and pricing

---

## 🔐 Role-Based Access Control

### Overview

The application implements a three-tier role system: ADMIN, MANAGER, and MEMBER. Each role has specific permissions and access levels.

### Role Hierarchy

```
ADMIN (Full Access)
  ├── All MANAGER permissions
  ├── User management
  ├── Payment method management
  └── Cross-country data access

MANAGER (Operational Access)
  ├── All MEMBER permissions
  ├── Order checkout
  ├── Order cancellation
  └── Country-scoped data access

MEMBER (Basic Access)
  ├── Browse restaurants
  ├── View menus
  ├── Create orders
  ├── Add items to cart
  └── Country-scoped data access
```

### Permission Matrix

| Action | ADMIN | MANAGER | MEMBER |
|--------|-------|---------|--------|
| Browse restaurants | ✅ | ✅ | ✅ |
| View menus | ✅ | ✅ | ✅ |
| Create orders | ✅ | ✅ | ✅ |
| Add items to cart | ✅ | ✅ | ✅ |
| Checkout orders | ✅ | ✅ | ❌ |
| Cancel orders | ✅ | ✅ | ❌ |
| View all countries | ✅ | ❌ | ❌ |
| Manage users | ✅ | ❌ | ❌ |
| Manage payment methods | ✅ | ❌ | ❌ |

---

## 🌐 Country-Scoped Data Access

### Overview

Data access is automatically filtered by country for non-admin users, ensuring users only see relevant content.

### Implementation

**Service Layer Filtering:**
```typescript
async getRestaurants(user: User) {
  if (user.role === 'ADMIN') {
    return this.restaurantRepo.findAll();
  }
  return this.restaurantRepo.findByCountry(user.country);
}
```

**Database Queries:**
```sql
-- For ADMIN users
SELECT * FROM restaurants;

-- For MANAGER/MEMBER users
SELECT * FROM restaurants WHERE country = 'IN';
```

### Benefits

1. **Data Isolation:** Users only access their country's data
2. **Performance:** Reduced data volume improves query speed
3. **Security:** Prevents unauthorized cross-country access
4. **User Experience:** Shows only relevant content

---

**Last Updated:** 2024-01-15  
**Version:** 1.0.0
