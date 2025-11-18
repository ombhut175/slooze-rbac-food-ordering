# Frontend Testing Guide for Admin Panel

This guide provides step-by-step instructions for manually testing the frontend admin panel features.

## Prerequisites

1. Backend server running on http://localhost:6932
2. Frontend server running (use `npm run dev` in the frontend directory)
3. Database seeded with test users (see credentials below)

## Test User Credentials

All users have the password: `Password123!`

- **ADMIN**: nick@example.com
- **MANAGER (IN)**: captain.marvel@example.com
- **MANAGER (US)**: captain.america@example.com
- **MEMBER (IN)**: thanos@example.com
- **MEMBER (US)**: travis@example.com

---

## Test 7.3: Frontend Admin Access Control

### Test 7.3.1: ADMIN User Access

1. Open the frontend application in your browser
2. Login with ADMIN credentials:
   - Email: `nick@example.com`
   - Password: `Password123!`
3. **Expected Results:**
   - ✓ Login successful
   - ✓ Admin navigation link is visible in the header/navigation menu
   - ✓ Clicking the Admin link navigates to `/admin`
   - ✓ Admin page loads successfully with both tabs visible (Users and Restaurants)
   - ✓ No console errors in browser developer tools

### Test 7.3.2: MANAGER User Access

1. Logout from the ADMIN account
2. Login with MANAGER credentials:
   - Email: `captain.marvel@example.com`
   - Password: `Password123!`
3. **Expected Results:**
   - ✓ Login successful
   - ✓ Admin navigation link is NOT visible in the header/navigation menu
4. Manually navigate to `/admin` by typing the URL in the browser
5. **Expected Results:**
   - ✓ Automatically redirected to `/dashboard`
   - ✓ Cannot access the admin page
   - ✓ No console errors

### Test 7.3.3: MEMBER User Access

1. Logout from the MANAGER account
2. Login with MEMBER credentials:
   - Email: `thanos@example.com`
   - Password: `Password123!`
3. **Expected Results:**
   - ✓ Login successful
   - ✓ Admin navigation link is NOT visible in the header/navigation menu
4. Manually navigate to `/admin` by typing the URL in the browser
5. **Expected Results:**
   - ✓ Automatically redirected to `/dashboard`
   - ✓ Cannot access the admin page
   - ✓ No console errors

---

## Test 7.4: Frontend User Management Features

### Prerequisites
- Login as ADMIN user (nick@example.com)
- Navigate to `/admin` and click the "Users" tab

### Test 7.4.1: User List Display

1. Verify the user table displays correctly
2. **Expected Results:**
   - ✓ Table shows all users with columns: Email, Role, Country, Email Verified, Created At
   - ✓ All 6+ users are visible
   - ✓ UI matches theme (orange/red gradients, proper spacing, rounded corners)

### Test 7.4.2: Search Filtering

1. Type a partial email in the search box (e.g., "thanos")
2. **Expected Results:**
   - ✓ Table filters to show only matching users
   - ✓ Filtering happens within 300ms of typing
   - ✓ Case-insensitive search works
3. Clear the search box
4. **Expected Results:**
   - ✓ All users are displayed again

### Test 7.4.3: Role Filter

1. Select "ADMIN" from the role filter dropdown
2. **Expected Results:**
   - ✓ Table shows only users with ADMIN role
   - ✓ Filter works correctly
3. Select "MANAGER" from the role filter dropdown
4. **Expected Results:**
   - ✓ Table shows only users with MANAGER role
5. Select "All Roles" to reset
6. **Expected Results:**
   - ✓ All users are displayed again

### Test 7.4.4: Country Filter

1. Select "IN" from the country filter dropdown
2. **Expected Results:**
   - ✓ Table shows only users from India
3. Select "US" from the country filter dropdown
4. **Expected Results:**
   - ✓ Table shows only users from United States
5. Select "All Countries" to reset
6. **Expected Results:**
   - ✓ All users are displayed again

### Test 7.4.5: Combined Filters

1. Type "captain" in search box
2. Select "MANAGER" from role filter
3. Select "IN" from country filter
4. **Expected Results:**
   - ✓ Table shows only captain.marvel@example.com (MANAGER from IN)
   - ✓ All filters work together correctly

### Test 7.4.6: Update User Role

1. Clear all filters
2. Find a user (e.g., thanos@example.com)
3. Click on their role dropdown and select a different role (e.g., change MEMBER to MANAGER)
4. **Expected Results:**
   - ✓ Loading indicator appears on the row
   - ✓ Success toast notification appears: "User role updated successfully"
   - ✓ Toast auto-dismisses after 3 seconds
   - ✓ Table updates with the new role
   - ✓ No console errors

### Test 7.4.7: Update User Country

1. Find a user (e.g., thanos@example.com)
2. Click on their country dropdown and select a different country
3. **Expected Results:**
   - ✓ Loading indicator appears on the row
   - ✓ Success toast notification appears: "User country updated successfully"
   - ✓ Toast auto-dismisses after 3 seconds
   - ✓ Table updates with the new country
   - ✓ No console errors

### Test 7.4.8: Self-Demotion Prevention

1. Find your own user (nick@example.com)
2. Try to change your own role
3. **Expected Results:**
   - ✓ Role selector is disabled for your own user
   - ✓ Cannot change your own role
   - ✓ Country selector still works for your own user

### Test 7.4.9: Error Handling

1. Open browser developer tools and go to Network tab
2. Stop the backend server (or block network requests)
3. Try to update a user's role
4. **Expected Results:**
   - ✓ Error toast notification appears with appropriate message
   - ✓ Toast auto-dismisses after 5 seconds
   - ✓ Table does not update (stays in previous state)
   - ✓ Error is handled gracefully

### Test 7.4.10: UI Theme Verification

1. Inspect the Users Management page
2. **Expected Results:**
   - ✓ Orange/red/pink gradient backgrounds are used
   - ✓ Framer-motion animations are present (smooth transitions)
   - ✓ Shadcn/ui components are used (Button, Table, Select, etc.)
   - ✓ Backdrop-blur effects on cards
   - ✓ Consistent spacing and rounded corners (rounded-xl)
   - ✓ Hover effects with scale and color transitions
   - ✓ Loading states with spinners

---

## Test 7.5: Frontend Restaurant Management Features

### Prerequisites
- Login as ADMIN user (nick@example.com)
- Navigate to `/admin` and click the "Restaurants" tab

### Test 7.5.1: Restaurant List Display

1. Verify the restaurant table displays correctly
2. **Expected Results:**
   - ✓ Table shows all restaurants with columns: Name, Country, Status, Created At, Updated At, Actions
   - ✓ All restaurants from both countries are visible
   - ✓ Country badges display correctly
   - ✓ Status badges display correctly (green for ACTIVE, gray for INACTIVE)
   - ✓ UI matches theme

### Test 7.5.2: Search Filtering

1. Type a partial restaurant name in the search box (e.g., "Spice")
2. **Expected Results:**
   - ✓ Table filters to show only matching restaurants
   - ✓ Filtering happens within 300ms of typing
   - ✓ Case-insensitive search works
3. Clear the search box
4. **Expected Results:**
   - ✓ All restaurants are displayed again

### Test 7.5.3: Country Filter

1. Select "IN" from the country filter dropdown
2. **Expected Results:**
   - ✓ Table shows only restaurants from India
3. Select "US" from the country filter dropdown
4. **Expected Results:**
   - ✓ Table shows only restaurants from United States
5. Select "All Countries" to reset

### Test 7.5.4: Status Filter

1. Select "ACTIVE" from the status filter dropdown
2. **Expected Results:**
   - ✓ Table shows only active restaurants
3. Select "INACTIVE" from the status filter dropdown
4. **Expected Results:**
   - ✓ Table shows only inactive restaurants
5. Select "All Status" to reset

### Test 7.5.5: Combined Filters

1. Type "American" in search box
2. Select "US" from country filter
3. Select "ACTIVE" from status filter
4. **Expected Results:**
   - ✓ Table shows only matching restaurants
   - ✓ All filters work together correctly

### Test 7.5.6: Create Restaurant

1. Clear all filters
2. Click the "Create Restaurant" button
3. **Expected Results:**
   - ✓ Modal opens with create form
   - ✓ Form has fields: Name, Country, Status
   - ✓ Modal has gradient styling and animations
4. Fill in the form:
   - Name: "Test Restaurant"
   - Country: "IN"
   - Status: "ACTIVE"
5. Click Submit
6. **Expected Results:**
   - ✓ Loading spinner appears on submit button
   - ✓ Success toast notification appears: "Restaurant created successfully"
   - ✓ Toast auto-dismisses after 3 seconds
   - ✓ Modal closes
   - ✓ Table refreshes and shows the new restaurant
   - ✓ No console errors

### Test 7.5.7: Edit Restaurant

1. Find a restaurant in the table
2. Click the edit button (or click on the row)
3. **Expected Results:**
   - ✓ Edit modal opens with pre-filled data
   - ✓ Form shows current restaurant details
4. Update the restaurant name (e.g., add " - Updated")
5. Click Submit
6. **Expected Results:**
   - ✓ Loading spinner appears on submit button
   - ✓ Success toast notification appears: "Restaurant updated successfully"
   - ✓ Toast auto-dismisses after 3 seconds
   - ✓ Modal closes
   - ✓ Table refreshes and shows the updated name
   - ✓ No console errors

### Test 7.5.8: Update Restaurant Status

1. Find a restaurant and click edit
2. Change the status (ACTIVE to INACTIVE or vice versa)
3. Click Submit
4. **Expected Results:**
   - ✓ Success toast appears
   - ✓ Table updates with new status
   - ✓ Status badge color changes appropriately

### Test 7.5.9: Country Change Validation

**Note:** This test only works if the restaurant has existing orders.

1. Find a restaurant that has orders (e.g., one of the seeded restaurants)
2. Click edit
3. Try to change the country
4. Click Submit
5. **Expected Results:**
   - ✓ Error toast notification appears with message about orders
   - ✓ Toast auto-dismisses after 5 seconds
   - ✓ Restaurant country is not changed
   - ✓ Error is handled gracefully

### Test 7.5.10: Error Handling

1. Open browser developer tools and go to Network tab
2. Stop the backend server (or block network requests)
3. Try to create a new restaurant
4. **Expected Results:**
   - ✓ Error toast notification appears
   - ✓ Toast auto-dismisses after 5 seconds
   - ✓ Modal stays open (doesn't close on error)
   - ✓ Error is handled gracefully

### Test 7.5.11: UI Theme Verification

1. Inspect the Restaurants Management page
2. **Expected Results:**
   - ✓ Orange/red gradient backgrounds are used
   - ✓ Framer-motion animations on modals and buttons
   - ✓ Shadcn/ui components (Dialog, Button, Table, Select)
   - ✓ Gradient "Create Restaurant" button (from-orange-600 to-red-600)
   - ✓ Backdrop-blur effects on cards and modals
   - ✓ Consistent spacing and rounded corners
   - ✓ Hover effects on table rows and buttons
   - ✓ Loading states with spinners

---

## Summary Checklist

### Backend Tests (Automated)
- [x] 7.1 Test backend user endpoints
- [x] 7.2 Test backend restaurant endpoints

### Frontend Tests (Manual)
- [ ] 7.3 Test frontend admin access control
  - [ ] 7.3.1 ADMIN user access
  - [ ] 7.3.2 MANAGER user access
  - [ ] 7.3.3 MEMBER user access
- [ ] 7.4 Test frontend user management features
  - [ ] 7.4.1 User list display
  - [ ] 7.4.2 Search filtering
  - [ ] 7.4.3 Role filter
  - [ ] 7.4.4 Country filter
  - [ ] 7.4.5 Combined filters
  - [ ] 7.4.6 Update user role
  - [ ] 7.4.7 Update user country
  - [ ] 7.4.8 Self-demotion prevention
  - [ ] 7.4.9 Error handling
  - [ ] 7.4.10 UI theme verification
- [ ] 7.5 Test frontend restaurant management features
  - [ ] 7.5.1 Restaurant list display
  - [ ] 7.5.2 Search filtering
  - [ ] 7.5.3 Country filter
  - [ ] 7.5.4 Status filter
  - [ ] 7.5.5 Combined filters
  - [ ] 7.5.6 Create restaurant
  - [ ] 7.5.7 Edit restaurant
  - [ ] 7.5.8 Update restaurant status
  - [ ] 7.5.9 Country change validation
  - [ ] 7.5.10 Error handling
  - [ ] 7.5.11 UI theme verification

---

## Notes

- All backend tests have been automated and passed successfully
- Frontend tests require manual interaction with the browser
- Check browser console for any errors during testing
- Verify that all API responses match the expected format
- Ensure proper logging is present in the backend console
- Test on different screen sizes if possible (responsive design)

## Test Results

Record your test results here:

```
Date: ___________
Tester: ___________

Test 7.3: [ ] PASS [ ] FAIL
Test 7.4: [ ] PASS [ ] FAIL
Test 7.5: [ ] PASS [ ] FAIL

Issues Found:
1. ___________
2. ___________
3. ___________
```
