

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS shahaji_tours 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE shahaji_tours;

-- ============================================
-- 1. CLIENTS TABLE (User Data)
-- ============================================
CREATE TABLE IF NOT EXISTS Clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_email ON Clients(email);
CREATE INDEX idx_phone ON Clients(phone);
CREATE INDEX idx_created_at ON Clients(created_at);

-- ============================================
-- 2. ROUTES TABLE (Route Data)
-- ============================================
CREATE TABLE IF NOT EXISTS Routes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    from_location VARCHAR(255) NOT NULL,
    to_location VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    seater_price DECIMAL(10, 2) DEFAULT 500.00,
    sleeper_price DECIMAL(10, 2) DEFAULT 800.00,
    duration VARCHAR(50) NOT NULL,
    timings TEXT NOT NULL,
    stops TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_locations ON Routes(from_location, to_location);
CREATE INDEX idx_created ON Routes(created_at);

-- ============================================
-- 3. ADMINS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS Admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_admin_email ON Admins(email);
CREATE INDEX idx_admin_active ON Admins(is_active);

-- Insert default admin (password: Shahaji@2025)
INSERT INTO Admins (name, email, password, role) 
VALUES ('Admin', 'admin@shahaji.com', 'Shahaji@2025', 'super_admin')
ON DUPLICATE KEY UPDATE name=name;

-- ============================================
-- 4. BOOKINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS Bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    route_id INT NOT NULL,
    booking_date DATE NOT NULL,
    travel_date DATE NOT NULL,
    travel_time VARCHAR(20) NOT NULL,
    num_passengers INT NOT NULL DEFAULT 1,
    seats TEXT,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    payment_status VARCHAR(50) DEFAULT 'unpaid',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES Clients(id) ON DELETE CASCADE,
    FOREIGN KEY (route_id) REFERENCES Routes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_client_bookings ON Bookings(client_id);
CREATE INDEX idx_route_bookings ON Bookings(route_id);
CREATE INDEX idx_booking_status ON Bookings(status);
CREATE INDEX idx_travel_date ON Bookings(travel_date);
CREATE INDEX idx_payment_status ON Bookings(payment_status);

-- ============================================
-- 5. TRANSACTIONS TABLE (Payment Transactions)
-- ============================================
CREATE TABLE IF NOT EXISTS Transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    client_id INT NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50),
    payment_details TEXT,
    transaction_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES Bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES Clients(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_booking_transactions ON Transactions(booking_id);
CREATE INDEX idx_client_transactions ON Transactions(client_id);
CREATE INDEX idx_transaction_status ON Transactions(status);
CREATE INDEX idx_transaction_date ON Transactions(created_at);
CREATE INDEX idx_transaction_id ON Transactions(transaction_id);

-- ============================================
-- 6. PAYMENT_HISTORY TABLE (Payment Transaction History)
-- ============================================
CREATE TABLE IF NOT EXISTS Payment_History (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_id INT NOT NULL,
    booking_id INT NOT NULL,
    client_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50),
    payment_status VARCHAR(50) DEFAULT 'success',
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    receipt_number VARCHAR(100) UNIQUE,
    notes TEXT,
    FOREIGN KEY (transaction_id) REFERENCES Transactions(id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES Bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES Clients(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_payment_client ON Payment_History(client_id);
CREATE INDEX idx_payment_booking ON Payment_History(booking_id);
CREATE INDEX idx_receipt ON Payment_History(receipt_number);
CREATE INDEX idx_payment_date ON Payment_History(payment_date);

-- ============================================
-- 7. PAYMENTS TABLE (Razorpay Integration)
-- ============================================
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(128) UNIQUE,
    payment_id VARCHAR(128),
    amount BIGINT,
    currency VARCHAR(8) DEFAULT 'INR',
    receipt VARCHAR(128),
    status VARCHAR(32) DEFAULT 'created',
    notes JSON,
    gateway_response LONGTEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL,
    INDEX idx_order_id (order_id),
    INDEX idx_payment_id (payment_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 8. SLIDER_IMAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS slider_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    image_url VARCHAR(500) NOT NULL,
    title VARCHAR(200),
    description TEXT,
    display_order INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL,
    INDEX idx_display_order (display_order),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 9. ADMIN_LOGS TABLE (Track admin actions)
-- ============================================
CREATE TABLE IF NOT EXISTS Admin_Logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    action VARCHAR(255) NOT NULL,
    table_name VARCHAR(100),
    record_id INT,
    details TEXT,
    ip_address VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES Admins(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_admin_logs ON Admin_Logs(admin_id);
CREATE INDEX idx_log_action ON Admin_Logs(action);
CREATE INDEX idx_log_date ON Admin_Logs(created_at);

-- ============================================
-- USEFUL VIEWS FOR EASY QUERIES
-- ============================================

-- View for complete booking details
CREATE OR REPLACE VIEW booking_details AS
SELECT 
    b.id as booking_id,
    b.booking_date,
    b.travel_date,
    b.travel_time,
    b.num_passengers,
    b.seats,
    b.total_amount,
    b.status as booking_status,
    b.payment_status,
    c.id as client_id,
    c.name as client_name,
    c.email as client_email,
    c.phone as client_phone,
    r.id as route_id,
    r.from_location,
    r.to_location,
    r.duration,
    r.seater_price,
    r.sleeper_price
FROM Bookings b
JOIN Clients c ON b.client_id = c.id
JOIN Routes r ON b.route_id = r.id;

-- View for transaction summary
CREATE OR REPLACE VIEW transaction_summary AS
SELECT 
    t.id as transaction_id,
    t.transaction_type,
    t.amount,
    t.payment_method,
    t.status as transaction_status,
    t.created_at as transaction_date,
    t.transaction_id as external_transaction_id,
    b.id as booking_id,
    b.travel_date,
    c.id as client_id,
    c.name as client_name,
    c.email as client_email,
    r.from_location,
    r.to_location
FROM Transactions t
JOIN Bookings b ON t.booking_id = b.id
JOIN Clients c ON t.client_id = c.id
JOIN Routes r ON b.route_id = r.id;

