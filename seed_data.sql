-- Add a sample organizer (required for foreign key)
INSERT INTO users (id, name, email, phone, city, bio) 
VALUES ('admin_1', 'Club Organizer', 'admin@cornerclub.in', '919876543210', 'Lucknow', 'Official admin of Corner Club.')
ON DUPLICATE KEY UPDATE name=name;

-- Add real sample events
INSERT INTO events (id, title, description, date, time, location, city, category, price, image, capacity, creatorId, status)
VALUES 
('evt_001', 'Corner Club Launch Party', 'Grand launch of the most exclusive hobby club in town!', '2026-02-15 19:00:00', '7:00 PM', 'Hazratganj, Lucknow', 'Lucknow', 'Social', 500.00, 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30', 200, 'admin_1', 'approved'),
('evt_002', 'Indie Music Night', 'A soul-filling night with local indie artists.', '2026-02-20 20:30:00', '8:30 PM', 'Gomti Nagar, Lucknow', 'Lucknow', 'Music', 299.00, 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4', 100, 'admin_1', 'approved'),
('evt_003', 'Street Photography Workshop', 'Learn to capture the soul of the city with our experts.', '2026-03-05 10:00:00', '10:00 AM', 'Old City, Lucknow', 'Lucknow', 'Workshop', 0.00, 'https://images.unsplash.com/photo-1452784444945-3f4227083624', 50, 'admin_1', 'approved')
ON DUPLICATE KEY UPDATE title=title;
