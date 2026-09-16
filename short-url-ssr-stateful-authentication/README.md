# URL Shortener (SSR with Stateful Authentication)

A Node.js and Express server-side rendered (SSR) URL shortener application featuring stateful authentication using HTTP cookies and in-memory session tracking, MongoDB persistence via Mongoose, NanoID generation, and click analytics tracking.

---

## Architecture & Data Flow Overview

```mermaid
graph TD
    Client[Client / Browser] -->|HTTP Requests| ExpressApp[Express Server (index.js)]
    
    subgraph Server Middleware Layer
        ExpressApp --> BodyParsers[express.json & express.urlencoded]
        BodyParsers --> CookieParser[cookie-parser]
        CookieParser --> AuthMiddleware[Auth Middlewares (middlewares/auth.js)]
    end

    subgraph Authentication & Sessions
        AuthMiddleware <--> SessionService[Session Store (services/auth.js - Map)]
    end

    subgraph Routing Layer
        AuthMiddleware --> StaticRouter[Static Router (routes/staticRouter.js)]
        AuthMiddleware --> UserRouter[User Router (routes/user.js)]
        AuthMiddleware --> UrlRouter[URL Router (routes/url.js)]
    end

    subgraph Controller Layer
        UserRouter --> UserController[User Controller (controllers/user.js)]
        UrlRouter --> UrlController[URL Controller (controllers/url.js)]
    end

    subgraph Data & Views Layer
        UserController <--> UserModel[User Model (models/user.js)]
        UrlController <--> UrlModel[URL Model (models/url.js)]
        StaticRouter <--> UrlModel
        UrlController --> EjsViews[EJS Views (views/*.ejs)]
        StaticRouter --> EjsViews
        
        UserModel <--> MongoDb[(MongoDB Database)]
        UrlModel <--> MongoDb
    end
```

---

## Program Execution & Startup Flow

1. **Initialization (`npm start`)**:
   - `nodemon index.js` runs `index.js` as the application entry point.
2. **Database Connection**:
   - `index.js` invokes `connectToMongoDb()` from `connect.js`, establishing a connection to MongoDB at `mongodb://127.0.0.1:27017/short-url`.
3. **Template Engine Configuration**:
   - Express configures `ejs` as the view engine and points the views directory to `./views`.
4. **Middleware Registration**:
   - Standard body parsers (`express.json()` and `express.urlencoded()`) process incoming request payloads.
   - `cookie-parser` parses incoming request headers for cookies (specifically the `uid` session cookie).
   - `express.static("public")` serves static assets.
5. **Route Registration**:
   - `/url` routes are protected by `restrictToLoggedInUserOnly` middleware and mounted to `urlRoute`.
   - `/user` routes are mounted to `userRoute`.
   - `/` root routes are wrapped with `checkAuth` middleware and mounted to `staticRoute`.
6. **Server Listen**:
   - The Express application binds to port `8000` and starts listening for incoming client requests.

---

## JavaScript Files Breakdown & Independent Functionality

Every `.js` file in this project follows a modular pattern with specific responsibilities:

### 1. `index.js` (Application Entry Point)
- **Role**: Bootstraps the server, configures global middleware, initializes database connectivity, mounts routers, and starts the server.
- **Dependencies**: `express`, `path`, `cookie-parser`, `./connect`, `./models/url`, `./routes/url`, `./routes/staticRouter`, `./routes/user`, `./middlewares/auth`.
- **How it works**: Connects to Mongo DB on startup, configures middleware stack, mounts express routers to path endpoints, and listens on port 8000.

### 2. `connect.js` (Database Connection Utility)
- **Role**: Encapsulates MongoDB connection logic using Mongoose.
- **Dependencies**: `mongoose`.
- **Exports**: `{ connectToMongoDb }`
- **How it works independently**: Accepts a MongoDB connection URI string and returns an async Mongoose connection promise with success and error logging.

---

### Services Layer

#### 3. `services/auth.js` (Stateful Session Store)
- **Role**: Maintains server-side session state mapping Session IDs (UUIDs) to User objects in-memory.
- **Dependencies**: None.
- **Exports**: `{ setUser, getUser }`
- **How it works independently**: Uses a JavaScript `Map` instance (`sessionIdToUserMap`) to store key-value pairs (`id -> user`).
  - `setUser(id, user)`: Adds a new session key and user record to the map.
  - `getUser(id)`: Retrieves a user record by session ID key.

---

### Models Layer (MongoDB Schemas)

#### 4. `models/user.js` (User Data Model)
- **Role**: Defines the database schema and model for registered users.
- **Dependencies**: `mongoose`.
- **Exports**: `User` Mongoose Model.
- **Fields**:
  - `name` (String, required)
  - `email` (String, required, unique)
  - `password` (String, required)
  - `timestamps` (auto-managed `createdAt`, `updatedAt`)

#### 5. `models/url.js` (URL Data Model)
- **Role**: Defines the database schema and model for shortened URLs and click tracking analytics.
- **Dependencies**: `mongoose`.
- **Exports**: `URL` Mongoose Model.
- **Fields**:
  - `shortId` (String, required, unique)
  - `redirectURL` (String, required)
  - `visitedHistory` (Array of objects containing `timestamp: Number`)
  - `createdBy` (ObjectId reference to `users` collection)
  - `timestamps` (auto-managed `createdAt`, `updatedAt`)

---

### Middlewares Layer

#### 6. `middlewares/auth.js` (Authentication Middlewares)
- **Role**: Intercepts requests to enforce or evaluate user session authentication via cookies.
- **Dependencies**: `../services/auth`.
- **Exports**: `{ restrictToLoggedInUserOnly, checkAuth }`
- **Functions**:
  - `restrictToLoggedInUserOnly(req, res, next)`: Reads the `uid` cookie from `req.cookies`. Looks up session user via `getUser(userUid)`. If missing, redirects to `/login`. If valid, attaches user object to `req.user` and calls `next()`.
  - `checkAuth(req, res, next)`: Soft authentication checker. Inspects `uid` cookie, retrieves user if present, assigns `req.user`, and calls `next()` regardless of whether user is logged in.

---

### Routes Layer

#### 7. `routes/staticRouter.js` (SSR Views Router)
- **Role**: Handles rendering of HTML views via EJS for public and home pages.
- **Dependencies**: `express`, `../models/url`.
- **Endpoints**:
  - `GET /`: Renders `home.ejs` displaying user's generated URLs (redirects to `/login` if `req.user` is unauthenticated).
  - `GET /signup`: Renders `signup.ejs`.
  - `GET /login`: Renders `login.ejs`.

#### 8. `routes/user.js` (User Account Actions Router)
- **Role**: Routes form submissions for user authentication.
- **Dependencies**: `express`, `../controllers/user`.
- **Endpoints**:
  - `POST /`: Handled by `handelUserSignUp`.
  - `POST /login`: Handled by `handelUserLogin`.

#### 9. `routes/url.js` (Short URL Actions Router)
- **Role**: Routes URL generation, redirection, and analytics.
- **Dependencies**: `express`, `../controllers/url`.
- **Endpoints**:
  - `POST /`: Handled by `handelGenerateNewShortUrl`.
  - `GET /:shortId`: Handled by `handelRedirectUrl`.
  - `GET /analytics/:shortId`: Handled by `handelGetAnalaytics`.

---

### Controllers Layer

#### 10. `controllers/user.js` (User Business Logic)
- **Role**: Handles account creation and login operations.
- **Dependencies**: `../models/user`, `uuid` (`v4`), `../services/auth`.
- **Functions**:
  - `handelUserSignUp(req, res)`: Extracts `name`, `email`, `password` from request body, creates a new user document in MongoDB, and redirects to `/`.
  - `handelUserLogin(req, res)`: Verifies user credentials against MongoDB. If invalid, re-renders `login.ejs` with error message. If valid, generates a UUID `sessionId`, registers `sessionId -> user` in `services/auth.js`, sets a cookie `res.cookie("uid", sessionId)`, and redirects to `/`.

#### 11. `controllers/url.js` (URL & Analytics Business Logic)
- **Role**: Handles short ID generation, URL lookup, redirection, and analytics generation.
- **Dependencies**: `nanoid`, `../models/url`.
- **Functions**:
  - `handelGenerateNewShortUrl(req, res)`: Validates URL format with regex. Checks if URL already exists in DB. Generates an 8-character `shortId` using `nanoid`, creates URL record tied to `req.user._id`, and renders `home.ejs` with the newly generated short ID.
  - `handelRedirectUrl(req, res)`: Finds the URL document by `shortId`, pushes the current timestamp into `visitedHistory`, and executes `res.redirect(entry.redirectURL)`.
  - `handelGetAnalaytics(req, res)`: Retrieves URL document by `shortId` and returns JSON payload containing `totalClicks` and `analytics` history array.

---

## Detailed Request Lifecycle Examples

### A. User Login Request Flow
```
User Submits Login Form (POST /user/login)
  │
  ▼
index.js ──> userRoute (routes/user.js)
  │
  ▼
handelUserLogin (controllers/user.js)
  │
  ├─► User.findOne({ email, password }) (models/user.js)
  │
  ├─► Generate session ID: sessionId = uuidv4()
  │
  ├─► setUser(sessionId, user) (services/auth.js)
  │
  ├─► res.cookie("uid", sessionId)
  │
  └─► res.redirect("/")
```

### B. Short URL Generation Flow
```
User Submits URL Form (POST /url)
  │
  ▼
index.js ──> restrictToLoggedInUserOnly (middlewares/auth.js)
  │            ├─ Check req.cookies.uid
  │            └─ getUser(uid) -> req.user
  ▼
urlRoute (routes/url.js)
  │
  ▼
handelGenerateNewShortUrl (controllers/url.js)
  │
  ├─► Regex URL Validation
  │
  ├─► Generate shortId = nanoid(8)
  │
  ├─► URL.create({ shortId, redirectURL, createdBy: req.user._id }) (models/url.js)
  │
  └─► res.render("home", { id: shortId }) (views/home.ejs)
```

### C. Redirection & Click Tracking Flow
```
User Visits Short URL (GET /url/:shortId)
  │
  ▼
index.js ──> restrictToLoggedInUserOnly (middlewares/auth.js)
  │
  ▼
urlRoute (routes/url.js)
  │
  ▼
handelRedirectUrl (controllers/url.js)
  │
  ├─► URL.findOneAndUpdate({ shortId }, { $push: { visitedHistory: { timestamp } } })
  │
  └─► res.redirect(entry.redirectURL)
```