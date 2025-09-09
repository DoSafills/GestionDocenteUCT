SELECT s.codigo      AS sala_codigo,
       s.numero      AS sala_numero,
       s.capacidad,
       s.tipo,
       s.piso,
       s.estado,
       e.codigo      AS edificio_codigo,
       e.nombre      AS edificio_nombre
FROM Sala s
JOIN Edificio e ON s.edificio_codigo = e.codigo
WHERE s.tipo = 'SALA CATEDRA' 
ORDER BY e.codigo, s.piso, s.numero;
