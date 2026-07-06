# Ultimate Backend Integration & Connection Handbook

This handbook provides the complete, exhaustive specification for wiring the Next.js React frontend to the Node.js/Express/MongoDB database backend. It includes full code mockups for server initialization, middlewares, routing patterns, complete Mongoose models, and exact request/response schemas for every feature.

---

## 1. Tech Stack Overview
- **Frontend**: Next.js (App Router, Tailwind CSS, Axios client).
- **Backend**: Node.js + Express.js REST API.
- **Database**: MongoDB using Mongoose schemas.
- **Authentication**: JWT (JSON Web Tokens) passed in the `Authorization: Bearer <token>` header.
- **Real-Time Layer**: Optional WebSockets (Socket.io) or HTTP polling fallbacks.

---

## 2. Complete Backend Setup Boilerplate

Currently, `backend/src/app.js` and `backend/src/index.js` are empty. Set them up as follows to connect MongoDB and launch the server.

### A. Core Server: `backend/src/app.js`
```javascript
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const app = express();

// Security and utility middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Custom Middleware imports
const { protect } = require('./middleware/auth.middleware');

// Root Route Hooks
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/founder', protect, require('./routes/founder.routes'));
app.use('/api/ideas', require('./routes/ideas.routes'));
app.use('/api/investor', protect, require('./routes/investor.routes'));
app.use('/api/chats', protect, require('./routes/chats.routes'));
app.use('/api/notifications', protect, require('./routes/notifications.routes'));

// Global 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    errors: err.errors || null
  });
});

module.exports = app;
```

### B. Server Bootstrapper: `backend/src/index.js`
```javascript
require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/something';

// Ensure MongoDB starts before listening
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB database.');
    app.listen(PORT, () => {
      console.log(`Express server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });
```

### C. JWT Authentication Middleware: `backend/src/middleware/auth.middleware.js`
```javascript
const jwt = require('jsonwebtoken');
const { Founder } = require('../models/founder.model');
const { Investor } = require('../models/investor.model');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
    
    // Check both potential roles
    let user = await Founder.findById(decoded.id).select('-password');
    if (!user) {
      user = await Investor.findById(decoded.id).select('-password');
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found in system index' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Session expired or signature invalid' });
  }
};
```

---

## 3. Exhaustive Mongoose Models Specification

These definitions detail the MongoDB fields and relations located in `backend/src/models/`.

### 1. Founder Model: `backend/src/models/founder.model.js`
```javascript
const mongoose = require('mongoose');

const founderSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  firm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Firm'
  }
}, { timestamps: true });

module.exports = { Founder: mongoose.model('Founder', founderSchema) };
```

### 2. Investor Model: `backend/src/models/investor.model.js`
```javascript
const mongoose = require('mongoose');

const investorSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: 'Anonymous Investor'
  },
  firm: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  minCheck: {
    type: Number,
    default: 10000
  },
  maxCheck: {
    type: Number,
    default: 100000
  },
  interests: [{
    type: String
  }],
  stageFocus: [{
    type: String,
    enum: ['Pre-seed', 'Angel', 'Seed']
  }],
  pacePerQuarter: {
    type: Number,
    default: 3
  },
  escrowRequired: {
    type: Boolean,
    default: true
  },
  ndaPreferred: {
    type: Boolean,
    default: false
  },
  publicProfile: {
    type: Boolean,
    default: true
  },
  handle: {
    type: String,
    default: ''
  },
  accreditedVerified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = { Investor: mongoose.model('Investor', investorSchema) };
```

### 3. Firm Detail: `backend/src/models/firm.model.js`
```javascript
const mongoose = require('mongoose');

const firmSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  firm_type: {
    type: String,
    enum: ['VC', 'Angel group', 'Accelerator', 'Family Office', 'Corporate VC']
  },
  founded_year: {
    type: Date,
    required: true
  },
  website_url: {
    type: String
  },
  linkedIn_url: {
    type: String,
    required: true
  },
  twitter_url: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  investment_focus: [{
    type: String
  }],
  stage_focus: [{
    type: String
  }],
  startups_invested_in: {
    type: Number,
    required: true,
    default: 0
  },
  notable_investments: [{
    type: String
  }]
}, { timestamps: true });

module.exports = { Firm: mongoose.model('Firm', firmSchema) };
```

### 4. Ideas / Pitch Decks Schema: `backend/src/models/idea.model.js`
```javascript
const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  fundsRequired: { type: Number, required: true },
  status: { type: String, enum: ['locked', 'released', 'pending'], default: 'locked' }
});

const ideaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  desc: { type: String, required: true },
  stage: { type: String, required: true },
  investmentNeeded: { type: Number, required: true },
  fundsGained: { type: Number, default: 0 },
  fundsSpent: { type: Number, default: 0 },
  domains: [{ type: String }],
  location: { type: String, required: true },
  launchedAt: { type: Date, default: Date.now },
  legalName: { type: String, default: '' },
  ndaSigned: { type: Boolean, default: false },
  milestones: [milestoneSchema],
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'Founder', required: true },
  likesCount: { type: Number, default: 0 },
  likers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Investor' }]
}, { timestamps: true });

module.exports = { Idea: mongoose.model('Idea', ideaSchema) };
```

### 5. Investments & Escrow Tracker: `backend/src/models/investments.model.js`
```javascript
const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  investor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Investor',
    required: true
  },
  founders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Founder',
    required: true
  }],
  stage: {
    type: String,
    enum: ['Pre-seed', 'seed', 'Series-A', 'Series-B', 'Series-C+', 'IPO']
  },
  committed: {
    type: Number,
    default: 0
  },
  released: {
    type: Number,
    default: 0
  },
  trustPoints: {
    type: Number,
    default: 0
  },
  next: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = { Investment: mongoose.model('Investment', investmentSchema) };
```

---

## 4. Endpoints Mapping & JSON Formats

Use the following specs to build out Express controllers:

### Route: `POST /api/auth/signup`
- **Description**: Registers temporary metadata and sends Nodemailer verification token.
- **Payload**:
  ```json
  {
    "email": "dev@something.io",
    "password": "hashed_pass_string",
    "username": "stellar_dev",
    "role": "founder"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Verification link dispatched to dev@something.io"
  }
  ```

### Route: `POST /api/auth/login`
- **Payload**:
  ```json
  {
    "email": "dev@something.io",
    "password": "hashed_pass_string"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "id": "60d0fe4f53112361a123f124",
      "email": "dev@something.io",
      "username": "stellar_dev",
      "role": "founder"
    }
  }
  ```

### Route: `GET /api/ideas/user`
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**:
  ```json
  [
    {
      "_id": "60d0fe4f53112361a123f888",
      "name": "DePIN Edge Mesh",
      "desc": "Local-first telemetry networks.",
      "stage": "Seed",
      "investmentNeeded": 50000,
      "fundsGained": 12000,
      "fundsSpent": 4500,
      "domains": ["Hardware", "Web3"],
      "location": "San Francisco, CA",
      "milestones": [
        { "title": "P2P Prototype", "description": "Sync nodes", "fundsRequired": 20000, "status": "released" }
      ]
    }
  ]
  ```

### Route: `POST /api/ideas`
- **Payload**:
  ```json
  {
    "name": "Local-first Analytics",
    "desc": "Decentralized analytical telemetry systems.",
    "stage": "Prototype",
    "investmentNeeded": 25000,
    "domains": ["SaaS", "Telemetry"],
    "location": "Boston, MA",
    "milestones": [
      { "title": "Alpha Launch", "description": "Test data relays", "fundsRequired": 10000 }
    ]
  }
  ```

### Route: `POST /api/investor/release-request`
- **Payload**:
  ```json
  {
    "investmentId": "60d0fe4f53112361a123f111",
    "milestoneId": "60d0fe4f53112361a123f222",
    "amount": 10000
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "releasedAmount": 10000,
    "remainingEscrow": 15000
  }
  ```

---

## 5. Real-Time Chat Infrastructure Specs

### Threads List API Response (`GET /api/chats`)
The list endpoints in `chats/page.tsx` expect thread lists structured as:
```json
[
  {
    "id": "th-lee-k",
    "name": "Lee Kun",
    "avatarUrl": "",
    "unread": 2,
    "preview": "We reviewed your telemetry reports, let's sync.",
    "lastActive": "15 mins ago",
    "category": "dealflow",
    "active": true
  }
]
```

### Messages History API Response (`GET /api/chats/:threadId/messages`)
```json
[
  {
    "id": "m-1",
    "from": "them",
    "text": "Hello, when can we discuss the seed milestones?",
    "when": "10:24 AM",
    "timestamp": 1783337535000
  },
  {
    "id": "m-2",
    "from": "you",
    "text": "I can share the deck files today.",
    "when": "10:30 AM",
    "timestamp": 1783337551000
  }
]
```

---

## 6. How to Hook Up the Connection

1. **Setup `.env` configuration**:
   Set `NEXT_PUBLIC_API_BASE_URL` in `frontend/.env.local`:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
   ```
2. **Review Axios Base Clients**:
   Ensure all network calls pull base parameters from `frontend/lib/axios.ts`.
3. **Remove Client Offline fallbacks**:
   Locate components with `try/catch` fallbacks (such as in `chats/page.tsx` and `investments/page.tsx`) and disable Mock arrays, enabling the application to render errors back to the UI boundaries when API requests fail.
