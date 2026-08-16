


create database InternProject;

USE InternProject;


SELECT *
FROM product;

SELECT id, sku, name, quantity, price, category_id
FROM product;

SELECT *
FROM product
WHERE sku = 'ELEC001';



SELECT *
FROM product
WHERE quantity <= 10;

delete from product where id  in(403);

SELECT
    category_id,
    COUNT(*) AS product_count
FROM product
GROUP BY category_id;

SELECT
    SUM(price * quantity) AS total_inventory_value
FROM product;

SELECT
    p.id,
    p.name AS product_name,
    p.sku,
    p.price,
    p.quantity,
    c.name AS category_name
FROM product p
JOIN category c
    ON p.category_id = c.id;
    
UPDATE product
SET quantity = 10
WHERE id = 402;

DELETE FROM product
WHERE id = 402;



