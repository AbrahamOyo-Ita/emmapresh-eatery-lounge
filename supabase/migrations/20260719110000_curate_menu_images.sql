-- Keep the published menu aligned with the available product photography.
DELETE FROM menu_items
WHERE name ILIKE '%EmmaPresh%'
   OR image IS NULL
   OR btrim(image) = ''
   OR slug = 'semo';

UPDATE menu_items
SET image = '/Fresh Watermelon Juice.jpeg',
    gallery = ARRAY['/Fresh Watermelon Juice.jpeg', '/Juices and drinks.jpeg']
WHERE slug = 'fresh-watermelon-juice';

UPDATE menu_items
SET image = '/Chapman Mocktail.jpeg',
    gallery = ARRAY['/Chapman Mocktail.jpeg', '/Juices and drinks2.jpeg']
WHERE slug = 'chapman-mocktail';

UPDATE menu_items
SET image = '/Espresso Coffee.jpeg',
    gallery = ARRAY['/Espresso Coffee.jpeg']
WHERE slug = 'espresso-coffee';

UPDATE menu_items
SET image = '/Veggie Supreme Pizza (12").jpeg',
    gallery = ARRAY['/Veggie Supreme Pizza (12").jpeg']
WHERE slug = 'veggie-supreme-pizza-12';

UPDATE menu_items
SET image = '/Chocolate doughnuts.jpeg',
    gallery = ARRAY['/Chocolate doughnuts.jpeg']
WHERE slug = 'chocolate-filled-doughnuts-box-of-6';
