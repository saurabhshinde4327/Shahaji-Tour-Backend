# Shahaji Tours Backend API

RESTful API backend for Shahaji Tours booking application built with Node.js, Express, and MariaDB.

## 📁 Project Structure

```
backend/
│
├── src/                         # Main source code
│   ├── config/                  # Configuration files
│   │   ├── database.js          # Database connection pool
│   │   └── index.js             # App configuration
│   ├── controllers/             # Route handlers / API controllers
│   │   ├── adminController.js
│   │   ├── bookingController.js
│   │   ├── clientController.js
│   │   ├── paymentController.js
│   │   ├── reportController.js
│   │   ├── routeController.js
│   │   └── transactionController.js
│   ├── routes/                  # API routes/endpoints
│   │   ├── adminRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── clientRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── routeRoutes.js
│   │   ├── transactionRoutes.js
│   │   └── index.js
│   ├── models/                  # Database models / schema
│   │   ├── Admin.js
│   │   ├── Booking.js
│   │   ├── Client.js
│   │   ├── Payment.js
│   │   ├── RazorpayPayment.js
│   │   ├── Route.js
│   │   └── Transaction.js
│   ├── services/                # Business logic
│   │   ├── adminService.js
│   │   ├── bookingService.js
│   │   ├── clientService.js
│   │   ├── paymentService.js
│   │   ├── reportService.js
│   │   └── routeService.js
│   ├── middleware/              # Middleware functions
│   │   ├── auth.js              # Authentication middleware
│   │   └── errorHandler.js      # Error handling middleware
│   ├── utils/                   # Helper / utility functions
│   │   ├── logger.js            # Logging utility
│   │   └── response.js          # Response helpers
│   ├── validators/              # Request validation schemas
│   │   ├── bookingValidator.js
│   │   ├── clientValidator.js
│   │   ├── routeValidator.js
│   │   └── transactionValidator.js
│   ├── constants/               # App constants
│   │   └── index.js
│   ├── database/                # DB connection files, migrations
│   │   └── migrations/
│   │       └── 001_initial_setup.sql
│   ├── app.js                   # Express app setup
│   └── server.js                # Server entry point
│
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MariaDB/MySQL database
- npm or yarn

### Installation

1. **Clone the repository and navigate to backend:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   DB_HOST=91.108.105.168
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=Saurabh@86684
   DB_NAME=shahaji_tours
   PORT=61
   NODE_ENV=development
   ```

4. **Set up the database:**
   ```bash
   mysql -h 91.108.105.168 -u root -p < src/database/migrations/001_initial_setup.sql
   ```

5. **Start the server:**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

## 📚 API Endpoints

### Health Check
- `GET /` - API status
- `GET /api/health` - Database health check

### Client Routes
- `POST /api/clients/register` - Register new client
- `POST /api/clients/login` - Client login
- `GET /api/clients/total` - Get total clients count

### Route Routes
- `GET /api/routes` - Get all routes
- `GET /api/routes/search?from=X&to=Y` - Search route by locations
- `POST /api/routes` - Create new route (Admin)
- `PUT /api/routes/:id` - Update route (Admin)
- `PUT /api/routes/:id/prices` - Update route prices (Admin)
- `DELETE /api/routes/:id` - Delete route (Admin)

### Booking Routes
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/:id` - Get booking by ID
- `GET /api/bookings/client/:clientId` - Get bookings by client
- `GET /api/bookings/booked-seats/:routeId/:travelDate/:travelTime` - Get booked seats
- `PUT /api/bookings/:id/status` - Update booking status
- `DELETE /api/bookings/:id` - Cancel booking

### Transaction Routes
- `POST /api/transactions` - Create transaction
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/:id` - Get transaction by ID
- `GET /api/transactions/client/:clientId` - Get transactions by client

### Payment Routes
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/webhook` - Razorpay webhook handler
- `GET /api/payments` - Get payment history
- `GET /api/payments/receipt/:receiptNumber` - Get payment by receipt
- `GET /api/payments/client/:clientId` - Get payments by client

### Admin Routes
- `POST /api/admin/login` - Admin login
- `GET /api/admin/clients` - Get all clients
- `GET /api/admin/bookings` - Get all bookings
- `GET /api/admin/dashboard/stats` - Get dashboard statistics
- `GET /api/admin/reports/revenue` - Get revenue report
- `GET /api/admin/reports/popular-routes` - Get popular routes

## 🗄️ Database

The application uses MariaDB with the following main tables:

- **Clients** - User/client data
- **Routes** - Bus/travel routes
- **Admins** - Admin accounts
- **Bookings** - Booking records
- **Transactions** - Payment transactions
- **Payment_History** - Payment history records
- **payments** - Razorpay integration
- **Admin_Logs** - Admin activity logs

### Default Admin Credentials

- **Email**: `admin@shahaji.com`
- **Password**: `Shahaji@2025`

⚠️ **Important**: Change the default admin password after first login!

## 🔧 Configuration

Configuration is managed through environment variables and `src/config/index.js`. Key settings:

- Database connection (host, port, user, password, database)
- Server port
- Razorpay API keys
- Application environment

## 📝 Development

### Project Structure Principles

- **Models**: Database queries and data access
- **Services**: Business logic and orchestration
- **Controllers**: Request/response handling
- **Routes**: Endpoint definitions
- **Validators**: Request validation
- **Middleware**: Cross-cutting concerns (auth, errors)
- **Utils**: Reusable helper functions

### Adding New Features

1. Create model in `src/models/`
2. Create service in `src/services/`
3. Create controller in `src/controllers/`
4. Create validator in `src/validators/`
5. Add routes in `src/routes/`
6. Register routes in `src/routes/index.js`

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test
```

## 📦 Dependencies

- **express** - Web framework
- **mysql2** - MySQL/MariaDB driver
- **cors** - CORS middleware
- **body-parser** - Request body parsing
- **razorpay** - Payment gateway integration
- **dotenv** - Environment variable management

## 🐛 Troubleshooting

### Database Connection Issues
- Verify database credentials in `.env`
- Check if MariaDB is running and accessible
- Ensure firewall allows connections on port 3306

### Port Already in Use
- Change `PORT` in `.env`
- Or kill the process using the port

## 📄 License

ISC

## 👥 Contributors

Shahaji Tours Development Team

