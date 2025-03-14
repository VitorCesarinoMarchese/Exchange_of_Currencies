/**
 * @swagger
 * openapi: 3.0.0
 * info:
 *   title: Currency Conversion API
 *   version: 1.0.0
 *   description: API for currency conversion, chart generation, authentication, and wallet management.
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: Use `Bearer <JWT>` to authenticate.
 * paths:
 *   /api/conversion:
 *     post:
 *       summary: Convert currency
 *       description: Convert an amount from one currency to another.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - amount
 *                 - from
 *                 - to
 *               properties:
 *                 amount:
 *                   type: number
 *                   example: 100
 *                   description: Amount to convert.
 *                 from:
 *                   type: string
 *                   example: "USD"
 *                   description: Source currency.
 *                 to:
 *                   type: string
 *                   example: "GBP"
 *                   description: Target currency.
 *       responses:
 *         200:
 *           description: Successful conversion
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   convertedAmount:
 *                     type: number
 *                     example: 75.50
 *                     description: Converted amount.
 *         400:
 *           description: Invalid input data
 *         500:
 *           description: Internal server error
 *   
 *   /api/chart/day/{currency}:
 *     get:
 *       summary: Get daily chart data for a currency pair
 *       description: Fetches the daily chart data for a specified currency pair (USDGBP, GBPUSD).
 *       parameters:
 *         - in: path
 *           name: currency
 *           required: true
 *           description: The currency pair (e.g., USDGBP or GBPUSD)
 *           schema:
 *             type: string
 *             enum: [USDGBP, GBPUSD]
 *       responses:
 *         200:
 *           description: Daily chart data
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   chartData:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         timestamp:
 *                           type: string
 *                         value:
 *                           type: number
 *         400:
 *           description: Invalid currency pair
 *         404:
 *           description: Data not found
 *         500:
 *           description: Internal server error
 *   /api/chart/week/{currency}:
 *     get:
 *       summary: Get weekly chart data for a currency pair
 *       description: Fetches the weekly chart data for a specified currency pair (USDGBP, GBPUSD).
 *       parameters:
 *         - in: path
 *           name: currency
 *           required: true
 *           description: The currency pair (e.g., USDGBP or GBPUSD)
 *           schema:
 *             type: string
 *             enum: [USDGBP, GBPUSD]
 *       responses:
 *         200:
 *           description: Weekly chart data
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   chartData:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         timestamp:
 *                           type: string
 *                         value:
 *                           type: number
 *         400:
 *           description: Invalid currency pair
 *         404:
 *           description: Data not found
 *         500:
 *           description: Internal server error
 * 
 *   /api/chart/month/{currency}:
 *     get:
 *       summary: Get monthly chart data for a currency pair
 *       description: Fetches the monthly chart data for a specified currency pair (USDGBP, GBPUSD).
 *       parameters:
 *         - in: path
 *           name: currency
 *           required: true
 *           description: The currency pair (e.g., USDGBP or GBPUSD)
 *           schema:
 *             type: string
 *             enum: [USDGBP, GBPUSD]
 *       responses:
 *         200:
 *           description: Monthly chart data
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   chartData:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         timestamp:
 *                           type: string
 *                         value:
 *                           type: number
 *         400:
 *           description: Invalid currency pair
 *         404:
 *           description: Data not found
 *         500:
 *           description: Internal server error
 * 
 *   /api/chart/year/{currency}:
 *     get:
 *       summary: Get yearly chart data for a currency pair
 *       description: Fetches the yearly chart data for a specified currency pair (USDGBP, GBPUSD).
 *       parameters:
 *         - in: path
 *           name: currency
 *           required: true
 *           description: The currency pair (e.g., USDGBP or GBPUSD)
 *           schema:
 *             type: string
 *             enum: [USDGBP, GBPUSD]
 *       responses:
 *         200:
 *           description: Yearly chart data
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   chartData:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         timestamp:
 *                           type: string
 *                         value:
 *                           type: number
 *         400:
 *           description: Invalid currency pair
 *         404:
 *           description: Data not found
 *         500:
 *           description: Internal server error
 *   /api/auth/register:
 *     post:
 *       summary: Register a new user
 *       description: Registers a new user with the provided details.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - name
 *                 - email
 *                 - password
 *               properties:
 *                 name:
 *                   type: string
 *                   example: 'John Doe'
 *                   description: Full name of the user.
 *                 email:
 *                   type: string
 *                   example: 'john.doe@example.com'
 *                   description: Email address of the user.
 *                 password:
 *                   type: string
 *                   example: 'yourpassword123'
 *                   description: Password for the user.
 *       responses:
 *         201:
 *           description: User registered successfully
 *         400:
 *           description: Invalid input data or missing required fields
 *         409:
 *           description: Email already in use
 *         500:
 *           description: Internal server error
 *   
 *   /api/auth/login:
 *     post:
 *       summary: Login a user and return a JWT token
 *       description: Authenticates a user by email and password, returning a JWT token for further requests.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - email
 *                 - password
 *               properties:
 *                 email:
 *                   type: string
 *                   example: 'john.doe@example.com'
 *                   description: Email of the user.
 *                 password:
 *                   type: string
 *                   example: 'yourpassword123'
 *                   description: Password for the user.
 *       responses:
 *         200:
 *           description: Login successful, JWT token returned
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   accessToken:
 *                     type: string
 *                   refreshToken:
 *                     type: string
 *                   user:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       email:
 *                         type: string
 *         400:
 *           description: Invalid credentials or missing fields
 *         401:
 *           description: Invalid email or password
 *         500:
 *           description: Internal server error

 *   /api/auth/refresh-token:
 *     post:
 *       summary: Refresh authentication token
 *       description: Refreshes the user's authentication token using the refresh token.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - refreshToken
 *               properties:
 *                 refreshToken:
 *                   type: string
 *                   description: Refresh token to get a new access token.
 *       responses:
 *         200:
 *           description: Successfully refreshed access token
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   accessToken:
 *                     type: string
 *         400:
 *           description: Missing or invalid refresh token
 *         401:
 *           description: Invalid refresh token
 *         500:
 *           description: Internal server error

 *   /api/auth/profile:
 *     get:
 *       summary: Get user profile
 *       description: Fetches the profile information of the logged-in user.
 *       security:
 *         - BearerAuth: []
 *       responses:
 *         200:
 *           description: User profile information
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   email:
 *                     type: string
 *                   name:
 *                     type: string
 *         401:
 *           description: Unauthorized access, token required
 *         500:
 *           description: Internal server error
 *   /api/exchange/wallet/{user_id}:
 *     get:
 *       summary: Retrieve the wallet of a user
 *       description: Fetches the wallet data (USD and GBP amounts) for a given user.
 *       parameters:
 *         - in: path
 *           name: user_id
 *           required: true
 *           description: ID of the user whose wallet is to be fetched.
 *           schema:
 *             type: string
 *       security:
 *         - BearerAuth: []
 *       responses:
 *         200:
 *           description: User's wallet details
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   wallet:
 *                     type: object
 *                     properties:
 *                       usd:
 *                         type: number
 *                       gbp:
 *                         type: number
 *         400:
 *           description: Invalid user ID format
 *         403:
 *           description: Unauthorized access, token required
 *         404:
 *           description: User not found
 *         500:
 *           description: Internal server error

 *   /api/exchange/addfunds/{user_id}:
 *     post:
 *       summary: Add funds to a user's wallet
 *       description: Adds specified amounts of USD and GBP to a user's wallet.
 *       parameters:
 *         - in: path
 *           name: user_id
 *           required: true
 *           description: ID of the user to add funds to.
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - usd
 *                 - gbp
 *               properties:
 *                 usd:
 *                   type: number
 *                   example: 100
 *                   description: Amount of USD to add.
 *                 gbp:
 *                   type: number
 *                   example: 100
 *                   description: Amount of GBP to add.
 *       security:
 *         - BearerAuth: []
 *       responses:
 *         200:
 *           description: Funds added successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   wallet:
 *                     type: object
 *                     properties:
 *                       usd:
 *                         type: number
 *                       gbp:
 *                         type: number
 *         400:
 *           description: Invalid amounts or missing fields
 *         403:
 *           description: Unauthorized access, token required
 *         404:
 *           description: User not found
 *         500:
 *           description: Internal server error

 *   /api/exchange/transaction:
 *     post:
 *       summary: Record a transaction
 *       description: Records a currency transaction for a user (conversion between USD and GBP).
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - currency
 *                 - amount
 *                 - user_id
 *                 - rate
 *               properties:
 *                 currency:
 *                   type: string
 *                   example: "USDGBP"
 *                   description: The currency pair for the transaction.
 *                 amount:
 *                   type: number
 *                   example: 50
 *                   description: The amount to convert.
 *                 user_id:
 *                   type: string
 *                   example: "609b2d5c6f83b3b8b1f91f23"
 *                   description: The user who is performing the transaction.
 *                 rate:
 *                   type: number
 *                   example: 0.75
 *                   description: The exchange rate used for conversion.
 *       security:
 *         - BearerAuth: []
 *       responses:
 *         200:
 *           description: Transaction recorded successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   document:
 *                     type: object
 *                     description: The transaction document.
 *                   total:
 *                     type: number
 *                     description: The total value after conversion.
 *         400:
 *           description: Invalid input data or insufficient funds
 *         401:
 *           description: Unauthorized access, token required
 *         404:
 *           description: User not found or wallet not found
 *         500:
 *           description: Internal server error

 *   /api/exchange/transaction_history/{user_id}:
 *     get:
 *       summary: Get transaction history of a user
 *       description: Retrieves the transaction history for a specific user.
 *       parameters:
 *         - in: path
 *           name: user_id
 *           required: true
 *           description: ID of the user whose transaction history is to be retrieved.
 *           schema:
 *             type: string
 *       security:
 *         - BearerAuth: []
 *       responses:
 *         200:
 *           description: Transaction history retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   recentTransactions:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         user_id:
 *                           type: string
 *                         amount:
 *                           type: number
 *                         from:
 *                           type: string
 *                         to:
 *                           type: string
 *                         rate:
 *                           type: number
 *         400:
 *           description: Invalid user ID format
 *         401:
 *           description: Unauthorized access, token required
 *         404:
 *           description: User or transactions not found
 *         500:
 *           description: Internal server error
 */
