# FIX_project

### General Info
***
The repository is composed of 3 subdirectories, discussed indipendently in the following.

## MSSQL
***

The MSSQL subdirectory contains the Docker composer for setting-up the MSSQL Database.
In order to create the database, it is, first, required to create a bridge docker network with the following ocmmand:
```
docker network create network-example
```
If successful, to proceed with the start of the Database, type the follwing:
```
docker compose up -d
```
The Dockerfile gives the possibility to start the container with different preliminary operations on the table structure, by setting a dedicate env variable.
The possibility are the following.
```
ENV mode=2
# 1: Database is dropped, tables are recreated and dummy data is loaded in the tables
# 2: Database is dropped, only tables are created
# 3: No operations are performed
```
The Database exposes port 1433.


## WebApp
***

The WebApp subdirectory conntains the NodeJs/AngularJs interface to interact with the database.
In order to run it, the Docker should be started with the followin command:
```
docker compose up -d
```
After few seconds, the interface is accessible at: http://localhost:8086


## Data_pipeline
***

The data_pipeline subdirectory contains the Python scripts to process the FIX log file and to generate the pseudo-random data.
In particular, to parse and load the FIX log provided for this exercise, use the following command:
```
python File_LOAD_DB.py
```
It requires Python 3.X


