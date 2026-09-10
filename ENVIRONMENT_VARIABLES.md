# Environment variables

Copy the variable names below into the deployment platform's secret manager or a local `.env` file. Replace every placeholder with a value belonging to the company. Do not commit the populated `.env` file.

```bash
NODE_ENV=development
PORT=3000

DATABASE_URL=mysql://USER:PASSWORD@HOST:3306/DATABASE_NAME

VITE_APP_ID=your_manus_app_id
JWT_SECRET=replace_with_a_long_random_secret
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://auth.manus.im
OWNER_OPEN_ID=owner_open_id_from_manus_oauth
OWNER_NAME=Company Owner

BUILT_IN_FORGE_API_URL=https://forge.manus.im
BUILT_IN_FORGE_API_KEY=server_side_api_key
VITE_FRONTEND_FORGE_API_URL=https://forge.manus.im
VITE_FRONTEND_FORGE_API_KEY=frontend_api_key_if_required

VITE_APP_TITLE=medical.sketcher
VITE_APP_LOGO=

SHOPIFY_STORE_DOMAIN=
SHOPIFY_STOREFRONT_API_ACCESS_TOKEN=

# PayPal server-side credentials (never expose these as VITE_ variables)
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_BASE_URL=https://api-m.sandbox.paypal.com
PAYPAL_RECEIVER_EMAIL=aboodaslah@gmail.com

VITE_ANALYTICS_ENDPOINT=
VITE_ANALYTICS_WEBSITE_ID=
```

`DATABASE_URL`, `JWT_SECRET`, `VITE_APP_ID`, `OAUTH_SERVER_URL`, `OWNER_OPEN_ID`, `BUILT_IN_FORGE_API_URL`, and `BUILT_IN_FORGE_API_KEY` are required for a complete production setup. Shopify and analytics variables are optional for the current Instagram Direct ordering flow.

Use a long, randomly generated `JWT_SECRET`. The production database must be MySQL-compatible, and the OAuth application must allow the final HTTPS domain and callback path. Values beginning with `VITE_` can be exposed to the browser by the build system; never place server-only secrets in a `VITE_` variable.
