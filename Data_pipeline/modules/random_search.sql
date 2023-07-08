
DECLARE @id INT;
SET @id = (SELECT COUNT(*) FROM Fix_messages);

PRINT @id;
SET @id = ((SELECT RAND() )* @id);

PRINT @id;

SELECT a.*,
    (SELECT c.Alias, b.val, b.Attr
        FROM Attribute b
        INNER JOIN Attr_Aliases c
        ON b.Attr = c.Attr_ID
        WHERE a.ID=b.FIX_ID and a.Version = c.Version
        FOR JSON PATH
    ) obj
FROM Fix_messages a WHERE a.ID = @id;


