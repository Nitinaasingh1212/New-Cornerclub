-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    bio TEXT,
    city VARCHAR(100),
    profileImage LONGTEXT,
    portfolio JSON,
    instagram VARCHAR(255),
    facebook VARCHAR(255),
    youtube VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Events Table
CREATE TABLE IF NOT EXISTS events (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date DATETIME NOT NULL,
    time VARCHAR(100),
    location VARCHAR(255),
    city VARCHAR(100),
    category VARCHAR(100),
    price DECIMAL(10, 2) DEFAULT 0,
    currency VARCHAR(10) DEFAULT 'INR',
    image LONGTEXT,
    capacity INT DEFAULT 100,
    attendees INT DEFAULT 0,
    creatorId VARCHAR(255),
    organizer VARCHAR(255),
    phone VARCHAR(20),
    address VARCHAR(255),
    social JSON,
    gallery JSON,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (creatorId) REFERENCES users(id) ON DELETE SET NULL
);

-- Create Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    eventId VARCHAR(255),
    userId VARCHAR(255),
    quantity INT DEFAULT 1,
    userDetails JSON,
    paymentDetails JSON,
    status VARCHAR(50) DEFAULT 'confirmed',
    bookedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (eventId) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Favorites Table
CREATE TABLE IF NOT EXISTS favorites (
    userId VARCHAR(255),
    eventId VARCHAR(255),
    addedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (userId, eventId),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (eventId) REFERENCES events(id) ON DELETE CASCADE
);
