# eCommerce-nest-vue

## Design
### Database Schema:

1. Users table: id (Primary Key), email (Unique), password_hash, created_at, updated_at
2. Categories table: id (Primary Key), name, description
3. UserInterests table: id (Primary Key), user_id (Foreign Key), category_id (Foreign Key), selected (Boolean)

### API Endpoints:

1. POST /api/auth/signup: Create a new user account.
2. POST /api/auth/login: Log in an existing user.
3. GET /api/categories?page=:page: Fetch a list of categories (:page: per page).
4. GET /api/categories/:id: Fetch a specific category.
5. PUT /api/users/:userId/interests: Update user interests.
6. GET /api/users/me: Fetch logged-in user details.

### Authentication
Mechanism: JWT
Package: jsonwebtoken
Framework: Vue.js, Next.js