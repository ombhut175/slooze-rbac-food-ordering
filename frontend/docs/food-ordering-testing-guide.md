# Food Ordering Feature - Testing Guide

This guide provides step-by-step instructions for testing the food ordering feature.

---

## Prerequisites

### 1. Backend API Running
Ensure the backend API is running on the configured URL (check `.env.local`):
```bash
cd backend
npm run start:dev
```

### 2. Frontend Application Running
```bash
cd frontend
npm run dev
```

### 3. Test User Accounts
You need three test accounts with different roles:
- ADMIN user (any country)
- MANAGER user (any country)
- MEMBER user (any country)

### 4. Test Data
Ensure the backend has:
- At least 2 restaurants per country (IN, US)
- At least 5 menu items per restaurant
- At least 2 payment methods

---

## Test Scenarios

### Scenario 1: Browse Restaurants (All Roles)

**Steps:**
1. Login with any test account
2. Click "Restaurants" in navigation
3. Verify restaurants are displayed
4. Check country badges (ADMIN sees all countries, others see only their country)
5. Click on a restaurant card

**Expected Results:**
- ✅ Restaurants load without errors
- ✅ Country filtering works based on role
- ✅ Cards display restaurant name and country
- ✅ Clicking navigates to menu page

---

### Scenario 2: View Menu and Add to Cart (All Roles)

**Steps:**
1. On restaurant menu page, view menu items
2. Click "Add to Cart" on a menu item
3. Verify success toast appears
4. Click cart icon to open cart sidebar
5. Verify item appears in cart
6. Add more items
7. Verify cart updates

**Expected Results:**
- ✅ Menu items display with prices
- ✅ Add to cart creates order automatically
- ✅ Success toast shows "Item added to cart"
- ✅ Cart sidebar opens with items
- ✅ Cart total calculates correctly
- ✅ Currency format matches country (INR/USD)

---

### Scenario 3: Manage Cart Items (All Roles)

**Steps:**
1. Open cart sidebar
2. Increase quantity using + button
3. Verify quantity updates
4. Decrease quantity using - button
5. Click remove button on an item
6. Verify item is removed

**Expected Results:**
- ✅ Quantity updates immediately (optimistic)
- ✅ Total recalculates correctly
- ✅ Remove item works
- ✅ Success toasts appear
- ✅ No console errors

---

### Scenario 4: Checkout Flow (ADMIN/MANAGER Only)

**Steps:**
1. Login as ADMIN or MANAGER
2. Add items to cart
3. Open cart sidebar
4. Click "Proceed to Checkout" button
5. Verify checkout page loads
6. Select a payment method
7. Click "Complete Order"
8. Verify confirmation page displays

**Expected Results:**
- ✅ Checkout button visible for ADMIN/MANAGER
- ✅ Checkout button hidden for MEMBER
- ✅ Payment methods load
- ✅ Order completes successfully
- ✅ Confirmation page shows order details
- ✅ Cart clears after checkout
- ✅ Order status is PAID

---

### Scenario 5: View Orders (All Roles)

**Steps:**
1. Click "Orders" in navigation
2. Verify orders list displays
3. Filter by status (All, Draft, Paid, Canceled)
4. Click on an order
5. View order details

**Expected Results:**
- ✅ Orders load without errors
- ✅ Country filtering works (non-admin sees only their country)
- ✅ Status badges display correctly
- ✅ Filters work
- ✅ Order details page shows all items
- ✅ Payment information visible for PAID orders

---

### Scenario 6: Cancel Order (ADMIN/MANAGER Only)

**Steps:**
1. Login as ADMIN or MANAGER
2. Navigate to orders list
3. Click on a PAID order
4. Click "Cancel Order" button
5. Confirm cancellation in dialog
6. Verify order status updates

**Expected Results:**
- ✅ Cancel button visible for ADMIN/MANAGER
- ✅ Cancel button hidden for MEMBER
- ✅ Confirmation dialog appears
- ✅ Order status changes to CANCELED
- ✅ Success toast appears
- ✅ Orders list refreshes

---

### Scenario 7: Payment Methods Management (ADMIN Only)

**Steps:**
1. Login as ADMIN
2. Click "Payment Methods" in navigation
3. Click "Create Payment Method"
4. Fill form:
   - Label: "Test Card"
   - Brand: "Visa"
   - Last 4: "1234"
   - Expiry: 12/2025
   - Country: IN
   - Default: Yes
5. Submit form
6. Verify payment method appears in list
7. Click edit on payment method
8. Update label
9. Submit form
10. Verify update works

**Expected Results:**
- ✅ Payment Methods link visible only for ADMIN
- ✅ Non-admin redirected to dashboard
- ✅ Create form validates inputs
- ✅ Payment method created successfully
- ✅ Edit form pre-fills data
- ✅ Update works correctly
- ✅ Default badge shows on default method

---

### Scenario 8: Role-Based UI Testing

**Test with ADMIN:**
- ✅ Can see all restaurants (all countries)
- ✅ Can see all orders (all countries)
- ✅ Can checkout orders
- ✅ Can cancel orders
- ✅ Can access payment methods page
- ✅ Sees country badges on data

**Test with MANAGER:**
- ✅ Sees only own country restaurants
- ✅ Sees only own country orders
- ✅ Can checkout orders
- ✅ Can cancel orders
- ✅ Cannot access payment methods page
- ✅ Payment Methods link not in navigation

**Test with MEMBER:**
- ✅ Sees only own country restaurants
- ✅ Sees only own country orders
- ✅ Cannot checkout orders (button hidden)
- ✅ Cannot cancel orders (button hidden)
- ✅ Cannot access payment methods page
- ✅ Can only browse and add to cart

---

### Scenario 9: Error Handling

**Test Network Errors:**
1. Stop backend API
2. Try to load restaurants
3. Verify error message displays
4. Verify retry option available

**Test Validation Errors:**
1. Try to create payment method with empty label
2. Verify validation error shows
3. Try to add invalid expiry date
4. Verify validation error shows

**Test Permission Errors:**
1. Login as MEMBER
2. Try to access `/payment-methods` directly via URL
3. Verify redirect to dashboard
4. Verify error message shows

**Expected Results:**
- ✅ Network errors show user-friendly messages
- ✅ Validation errors show inline
- ✅ Permission errors redirect appropriately
- ✅ All errors logged to console with hackLog

---

### Scenario 10: Responsive Design

**Test on Mobile (< 768px):**
1. Resize browser to mobile width
2. Navigate through all pages
3. Test cart sidebar
4. Test forms
5. Test navigation menu

**Test on Tablet (768px - 1023px):**
1. Resize browser to tablet width
2. Verify grid layouts adjust
3. Test all interactions

**Test on Desktop (> 1024px):**
1. Full screen browser
2. Verify all features work
3. Test hover effects

**Expected Results:**
- ✅ All pages responsive
- ✅ Navigation adapts to screen size
- ✅ Cart sidebar works on mobile
- ✅ Forms usable on all sizes
- ✅ Touch interactions work

---

### Scenario 11: Dark Mode

**Steps:**
1. Click theme toggle in navigation
2. Switch to dark mode
3. Navigate through all pages
4. Verify colors and contrast
5. Test all components

**Expected Results:**
- ✅ All pages support dark mode
- ✅ Colors adjust appropriately
- ✅ Text readable in dark mode
- ✅ Status badges readable
- ✅ Forms usable in dark mode

---

## Console Checks

During all testing, monitor browser console for:

### Should NOT See:
- ❌ TypeScript errors
- ❌ React errors
- ❌ Network errors (except when testing error scenarios)
- ❌ Unhandled promise rejections
- ❌ Warning messages

### Should See (hackLog):
- ✅ Component mount logs
- ✅ API request logs
- ✅ API success logs
- ✅ Store action logs
- ✅ Route change logs
- ✅ Form submit logs

---

## Performance Checks

### Page Load Times
- ✅ Restaurants page loads < 2 seconds
- ✅ Menu page loads < 2 seconds
- ✅ Orders page loads < 2 seconds
- ✅ Checkout page loads < 1 second

### Interactions
- ✅ Add to cart feels instant (optimistic update)
- ✅ Cart updates feel instant
- ✅ Navigation is smooth
- ✅ Animations are smooth (60fps)

---

## Validation Commands

Run these commands to verify code quality:

### Frontend
```bash
cd frontend
npm run validate
```
Expected: ✅ 0 errors, 0 warnings

### Backend
```bash
cd backend
npm run validate
```
Expected: ✅ 0 errors, 0 warnings

---

## Bug Reporting Template

If you find any issues during testing, report them using this template:

```markdown
### Bug Report

**Title:** [Brief description]

**Severity:** [Critical / High / Medium / Low]

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**User Role:** [ADMIN / MANAGER / MEMBER]

**Browser:** [Chrome / Firefox / Safari / Edge]

**Console Errors:**
[Copy any console errors]

**Screenshots:**
[Attach if applicable]
```

---

## Success Criteria

The feature is considered fully tested when:

- ✅ All 11 test scenarios pass
- ✅ All role-based tests pass
- ✅ All error scenarios handled correctly
- ✅ Responsive design works on all screen sizes
- ✅ Dark mode works correctly
- ✅ No console errors or warnings
- ✅ Performance is acceptable
- ✅ Validation commands pass

---

## Quick Test Checklist

Use this checklist for quick regression testing:

- [ ] Browse restaurants
- [ ] View menu
- [ ] Add to cart
- [ ] Update quantity
- [ ] Remove item
- [ ] Checkout (ADMIN/MANAGER)
- [ ] View orders
- [ ] Cancel order (ADMIN/MANAGER)
- [ ] Manage payment methods (ADMIN)
- [ ] Test role-based UI
- [ ] Test error handling
- [ ] Test responsive design
- [ ] Test dark mode
- [ ] Check console for errors
- [ ] Run validation commands

---

**Happy Testing! 🚀**
