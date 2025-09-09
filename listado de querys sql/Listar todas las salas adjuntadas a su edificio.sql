SELECT e.codigo   AS edificio_codigo,
       e.nombre   AS edificio_nombre,
       s.codigo   AS sala_codigo,
       s.numero   AS sala_numero,
       s.capacidad,
       s.tipo,
       s.piso,
       s.estado
FROM Edificio e
LEFT JOIN Sala s ON e.codigo = s.edificio_codigo
ORDER BY e.codigo, s.piso, s.numero;
