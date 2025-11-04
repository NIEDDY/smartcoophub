# TODO: Add Full Swagger Documentation

## Step 1: Update swagger.ts to include schemas and tags ✅
- Add components.schemas for all request/response models based on validation schemas.
- Add tags for grouping endpoints (Auth, Cooperatives, Members, Products, Orders, Webhooks).

## Step 2: Add Swagger UI route in src/index.ts ✅
- Serve Swagger UI at /api-docs using swagger-ui-express and swaggerSpec.

## Step 3: Add JSDoc annotations to route files ✅
- auth.routes.ts: Annotate all auth endpoints.
- cooperative.routes.ts: Annotate cooperative endpoints.
- member.routes.ts: Annotate member endpoints.
- order.routes.ts: Annotate order endpoints.
- product.routes.ts: Annotate product endpoints.
- webhook.routes.ts: Annotate webhook endpoints (if needed, though webhooks might not be documented).

## Step 4: Test the setup
- Run the server and verify /api-docs loads correctly.
- Check that all endpoints are documented with parameters, responses, and security.
- Ensure no conflicts with main code.

## Step 5: Final verification
- Confirm Swagger docs are complete and accurate.
