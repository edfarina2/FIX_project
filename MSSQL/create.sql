USE master;
ALTER DATABASE FIX_DB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;

DROP DATABASE  IF EXISTS  FIX_DB;
GO

CREATE DATABASE FIX_DB;
GO

USE FIX_DB;

CREATE TABLE Fix_messages (
	ID Int IDENTITY PRIMARY KEY,
	Timestamp DATETIME,
	Version DECIMAL(10,1),
    Type CHAR NOT NULL,
    Checksum VARCHAR(45),
    TradSyst VARCHAR(45),
    Length Int
);

CREATE TABLE Attr_Aliases (
	ID Int IDENTITY PRIMARY KEY,
	Attr_ID int NOT NULL,
    Alias VARCHAR(45),
	Version DECIMAL(10,1)
);

GO

CREATE INDEX index1 ON Attr_Aliases (Attr_ID, Version);

CREATE TABLE Attribute (
	ID Int IDENTITY PRIMARY KEY,
	FIX_ID int NOT NULL,
    Attr Int NOT NULL,
    Val VARCHAR(45)
 --   FOREIGN KEY (FIX_ID) REFERENCES Fix_messages(ID) 
);
-- PARTITION BY KEY (FIX_ID, ID);
CREATE INDEX index1 ON Attribute (FIX_ID);

/*
USE FIX_DB;
IF  EXISTS (SELECT * FROM sys.database_principals WHERE name = 'FIX_pipeline')
DROP USER [FIX_pipeline]

USE master;
IF  EXISTS (SELECT * FROM sys.sql_logins WHERE name = 'FIX_pipeline_login')
DROP Login [FIX_pipeline_login]



CREATE LOGIN FIX_pipeline_login with password = 'P@ssWod123'
GO
use FIX_DB
go
CREATE USER FIX_pipeline for login FIX_pipeline_login
GO
GRANT SELECT, INSERT, UPDATE, DELETE ON FIX_DB.dbo.Attribute TO FIX_pipeline;
GO
*/



