# Test Backend User Endpoints
$baseUrl = "http://localhost:6932/api"

Write-Host "=== Testing Backend User Endpoints ===" -ForegroundColor Cyan
Write-Host ""

# Test 1: Login as ADMIN user
Write-Host "Test 1: Login as ADMIN user (nick@example.com)" -ForegroundColor Yellow
$adminLoginBody = @{
    email = "nick@example.com"
    password = "Password123!"
} | ConvertTo-Json

try {
    $adminLoginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $adminLoginBody -ContentType "application/json"
    $adminToken = $adminLoginResponse.data.accessToken
    $adminUserId = $adminLoginResponse.data.user.id
    Write-Host "SUCCESS: ADMIN login successful. Token obtained." -ForegroundColor Green
    Write-Host "  Admin User ID: $adminUserId" -ForegroundColor Gray
} catch {
    Write-Host "FAILED: ADMIN login failed" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 2: Get all users with ADMIN auth
Write-Host "Test 2: GET /users with ADMIN auth" -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $adminToken"
        "Content-Type" = "application/json"
    }
    $usersResponse = Invoke-RestMethod -Uri "$baseUrl/users" -Method Get -Headers $headers
    $allUsers = $usersResponse.data
    Write-Host "SUCCESS: GET /users successful. Retrieved $($allUsers.Count) users." -ForegroundColor Green
    
    # Find thanos user for testing
    $testUser = $allUsers | Where-Object { $_.email -eq "thanos@example.com" } | Select-Object -First 1
    $testUserId = $testUser.id
    $testUserEmail = $testUser.email
    $testUserRole = $testUser.role
    $testUserCountry = $testUser.country
    Write-Host "  Test User: $testUserEmail (Role: $testUserRole, Country: $testUserCountry)" -ForegroundColor Gray
} catch {
    Write-Host "FAILED: GET /users failed - $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "  Error Details: $($_.ErrorDetails.Message)" -ForegroundColor Gray
    exit 1
}

Write-Host ""

# Test 3: Update user role with ADMIN auth
Write-Host "Test 3: PATCH /users/:id/role with ADMIN auth" -ForegroundColor Yellow
$newRole = if ($testUserRole -eq "MEMBER") { "MANAGER" } else { "MEMBER" }
$updateRoleBody = @{
    role = $newRole
} | ConvertTo-Json

try {
    $updateRoleResponse = Invoke-RestMethod -Uri "$baseUrl/users/$testUserId/role" -Method Patch -Body $updateRoleBody -ContentType "application/json" -Headers $headers
    Write-Host "SUCCESS: PATCH /users/:id/role successful. Changed role from $testUserRole to $newRole." -ForegroundColor Green
} catch {
    Write-Host "FAILED: PATCH /users/:id/role failed" -ForegroundColor Red
}

Write-Host ""

# Test 4: Update user country with ADMIN auth
Write-Host "Test 4: PATCH /users/:id/country with ADMIN auth" -ForegroundColor Yellow
$newCountry = if ($testUserCountry -eq "IN") { "US" } else { "IN" }
$updateCountryBody = @{
    country = $newCountry
} | ConvertTo-Json

try {
    $updateCountryResponse = Invoke-RestMethod -Uri "$baseUrl/users/$testUserId/country" -Method Patch -Body $updateCountryBody -ContentType "application/json" -Headers $headers
    Write-Host "SUCCESS: PATCH /users/:id/country successful. Changed country from $testUserCountry to $newCountry." -ForegroundColor Green
} catch {
    Write-Host "FAILED: PATCH /users/:id/country failed" -ForegroundColor Red
}

Write-Host ""

# Test 5: Login as MANAGER user
Write-Host "Test 5: Login as MANAGER user (captain.marvel@example.com)" -ForegroundColor Yellow
$managerLoginBody = @{
    email = "captain.marvel@example.com"
    password = "Password123!"
} | ConvertTo-Json

try {
    $managerLoginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $managerLoginBody -ContentType "application/json"
    $managerToken = $managerLoginResponse.data.accessToken
    Write-Host "SUCCESS: MANAGER login successful. Token obtained." -ForegroundColor Green
} catch {
    Write-Host "FAILED: MANAGER login failed" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 6: Try to update user role with MANAGER auth (should fail with 403)
Write-Host "Test 6: PATCH /users/:id/role with MANAGER auth (should return 403)" -ForegroundColor Yellow
$managerHeaders = @{
    "Authorization" = "Bearer $managerToken"
}

try {
    $managerUpdateResponse = Invoke-RestMethod -Uri "$baseUrl/users/$testUserId/role" -Method Patch -Body $updateRoleBody -ContentType "application/json" -Headers $managerHeaders -ErrorAction Stop
    Write-Host "FAILED: PATCH /users/:id/role should have returned 403 but succeeded!" -ForegroundColor Red
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 403) {
        Write-Host "SUCCESS: PATCH /users/:id/role correctly returned 403 Forbidden for MANAGER user." -ForegroundColor Green
    } else {
        Write-Host "FAILED: PATCH /users/:id/role returned unexpected status code: $statusCode" -ForegroundColor Red
    }
}

Write-Host ""

# Test 7: Try self-demotion (ADMIN changing own role to MEMBER, should fail with 400)
Write-Host "Test 7: PATCH /users/:id/role with self-demotion (should return 400)" -ForegroundColor Yellow
$selfDemotionBody = @{
    role = "MEMBER"
} | ConvertTo-Json

try {
    $selfDemotionResponse = Invoke-RestMethod -Uri "$baseUrl/users/$adminUserId/role" -Method Patch -Body $selfDemotionBody -ContentType "application/json" -Headers $headers -ErrorAction Stop
    Write-Host "FAILED: Self-demotion should have returned 400 but succeeded!" -ForegroundColor Red
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 400) {
        Write-Host "SUCCESS: Self-demotion correctly returned 400 Bad Request." -ForegroundColor Green
        $errorResponse = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "  Error message: $($errorResponse.message)" -ForegroundColor Gray
    } else {
        Write-Host "FAILED: Self-demotion returned unexpected status code: $statusCode" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== Backend User Endpoints Testing Complete ===" -ForegroundColor Cyan
Write-Host "Please check the backend console output for proper logging with operation names." -ForegroundColor Yellow
