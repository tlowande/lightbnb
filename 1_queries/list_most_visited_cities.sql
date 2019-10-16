SELECT city, COUNT(reservations.*) as total_reservations
FROM reservations
JOIN properties ON properties.id = property_id
GROUP BY city
ORDER BY total_reservations DESC;