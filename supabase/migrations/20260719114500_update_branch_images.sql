UPDATE branches
SET image = CASE slug
  WHEN 'abuja' THEN '/EmmaPresh Abuja.png'
  WHEN 'lagos' THEN '/EmmaPresh Lagos.png'
  WHEN 'badagry' THEN '/EmmaPresh Badagry.png'
  ELSE image
END,
gallery = CASE slug
  WHEN 'abuja' THEN ARRAY['/EmmaPresh Abuja.png']
  WHEN 'lagos' THEN ARRAY['/EmmaPresh Lagos.png']
  WHEN 'badagry' THEN ARRAY['/EmmaPresh Badagry.png']
  ELSE gallery
END
WHERE slug IN ('abuja', 'lagos', 'badagry');
