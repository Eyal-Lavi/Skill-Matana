# Route Guards Overview

### ✅ GuestRoute.jsx  
For pages that should only be accessible to non-authenticated users (guests).  
Redirects authenticated users to the home page.

---

### ✅ ProtectedRoute.jsx  
Requires the user to be authenticated and have a specific `requiredId` permission.  
Redirects to login if not authenticated, to `/` if no `requiredId` provided, or to `/unauthorized` if lacking the required permission.

---

### ✅ AdminRoute.jsx  
Allows access only to authenticated users with admin privileges.  
Redirects to home page if not an admin or not authenticated.


---

### ✅ AuthenticatedRoute.jsx  
For routes that require the user to simply be logged in (no specific permission needed).  
Redirects to the login page if the user is not authenticated.

---