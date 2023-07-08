
var fs= require("fs");
var spawn = require('child_process').spawn;
var async = require('async');
// const { Pool, Client } = require('pg')
const request = require('request');


var sql = require("mssql");


var dbConfig = {
    user:  "sa",
    password: "<YourStrong@Passw0rd>",
    server: "mssql",
    database: "FIX_DB",
options: {
    trustedConnection: true,
    encrypt: true,
    enableArithAbort: true,
    trustServerCertificate: true,

  },
};



module.exports = {
  

  get_fix_versions: function (req, res, callbackTot){
    
    sql.connect(dbConfig, function (err) {
    console.log("Connected to database")

        sql.query('select DISTINCT(Version) from Attr_Aliases', function (err, res) {

          if (err){
            return callbackTot( null, {"results" : "ERROR: there was an error in chargingstation_table"});

          }
            return callbackTot( null, {"results" : res.recordset});

        })

    })

    
  },
  
  

  PopulateKey: function (req, res, callbackTot){
    sql.connect(dbConfig, function (err) {
        sql.query('select * from Attr_Aliases where Version='+req.body.val, function (err, res) {

          if (err){
            return callbackTot( err, {"results" : "ERROR: there was an error in chargingstation_table"});

          }
            return callbackTot( null, {"results" : res.recordset});

        })

    })

    
  },


  TradSystList: function (req, res, callbackTot){
    sql.connect(dbConfig, function (err) {
        sql.query('select DISTINCT(TradSyst) from Fix_messages', function (err, res) {

          if (err){
            return callbackTot( err, {"results" : "ERROR: there was an error in chargingstation_table"});

          }
            return callbackTot( null, {"results" : res.recordset});

        })

    })

    
  },


    TypeList: function (req, res, callbackTot){
    sql.connect(dbConfig, function (err) {
        sql.query('select DISTINCT(Type) from Fix_messages', function (err, res) {

          if (err){
            return callbackTot( err, {"results" : "ERROR: there was an error in chargingstation_table"});

          }
            return callbackTot( null, {"results" : res.recordset});

        })

    })

    
  },





  SearchByKey: function (req, res, callbackTot){
    sql.connect(dbConfig, function (err) {

      search_query = `
SELECT a.*,
    (SELECT c.Alias, b.val, b.Attr
        FROM Attribute b
        INNER JOIN Attr_Aliases c
        ON b.Attr = c.Attr_ID
        WHERE a.ID=b.FIX_ID and a.Version = c.Version 
        FOR JSON PATH
    ) obj
    FROM (SELECT a.* FROM Fix_messages a INNER JOIN
        (SELECT DISTINCT(l.ID) AS func
            FROM Fix_messages l INNER JOIN Attribute b on  l.ID=b.FIX_ID `

          if (req.body.val.length >0){
            search_query += " WHERE "

            for (var i=0 ; i<req.body.val.length-1; i++){

              search_query += (" (b.Attr = " + req.body.val[i]["ID"]+ " and b.Val  "+ req.body.val[i]["Val"] + ") OR ")
            }
            i = req.body.val.length-1
            search_query += ( " (b.Attr = " + req.body.val[i]["ID"]+ " and b.Val  "+ req.body.val[i]["Val"] + ") group by l.ID having  COUNT(l.ID) = "+ (i+1) )

          }

            search_query += `) f
      
            ON func = a.ID) a`


    
        sql.query(search_query, function (err, res) {

          if (err){
            return callbackTot( err, {"results" : "ERROR: there was an error in chargingstation_table"});

          }
            return callbackTot( null, {"results" : res.recordset});

        })

    })

    
  },
  


  TradSystSearch: function (req, res, callbackTot){
    sql.connect(dbConfig, function (err) {

      search_query = `
SELECT a.*,
    (SELECT c.Alias, b.val, b.Attr
        FROM Attribute b
        INNER JOIN Attr_Aliases c
        ON b.Attr = c.Attr_ID
        WHERE a.ID=b.FIX_ID and a.Version = c.Version 
        FOR JSON PATH
    ) obj
    FROM Fix_messages a  WHERE a.TradSyst = '`+req.body.val+`'`
    
        sql.query(search_query, function (err, res) {

          if (err){
            return callbackTot( err, {"results" : "ERROR: there was an error in chargingstation_table"});

          }
            return callbackTot( null, {"results" : res.recordset});

        })

    })
  },



  TypeSearch: function (req, res, callbackTot){
    sql.connect(dbConfig, function (err) {

      search_query = `
SELECT a.*,
    (SELECT c.Alias, b.val, b.Attr
        FROM Attribute b
        INNER JOIN Attr_Aliases c
        ON b.Attr = c.Attr_ID
        WHERE a.ID=b.FIX_ID and a.Version = c.Version 
        FOR JSON PATH
    ) obj
    FROM Fix_messages a  WHERE a.Type = '`+req.body.val+`'`
    
        sql.query(search_query, function (err, res) {

          if (err){
            return callbackTot( err, {"results" : "ERROR: there was an error in chargingstation_table"});

          }
            return callbackTot( null, {"results" : res.recordset});

        })

    })

    
  },


    IDSearch: function (req, res, callbackTot){
    sql.connect(dbConfig, function (err) {

      search_query = `
SELECT a.*,
    (SELECT c.Alias, b.val, b.Attr
        FROM Attribute b
        INNER JOIN Attr_Aliases c
        ON b.Attr = c.Attr_ID
        WHERE a.ID=b.FIX_ID and a.Version = c.Version 
        FOR JSON PATH
    ) obj
    FROM Fix_messages a  WHERE a.ID = '`+req.body.val+`'`
    
        sql.query(search_query, function (err, res) {

          if (err){
            return callbackTot( err, {"results" : "ERROR: there was an error in chargingstation_table"});

          }
            return callbackTot( null, {"results" : res.recordset});

        })

    })

    
  },
  


  UploadFix: function (req, res, callbackTot){
    sql.connect(dbConfig, function (err) {

    const string_query = (`INSERT INTO Fix_messages (Timestamp, Version, Type, Checksum, Length, TradSyst) VALUES ('${req.body.Fix["Datetime"]}', ${req.body.Fix["BeginString"]}, '${req.body.Fix["MsgType"]}', ${req.body.Fix["Checksum"]}, ${req.body.Fix["BodyLength"]}, '${req.body.Fix["TradSys"]}');
      SELECT SCOPE_IDENTITY() AS id;`);
      
        sql.query(string_query, function (err, res) {

          if (err){
            console.log(err)
            return callbackTot( err, {"results" : "ERROR: there was an error in chargingstation_table"});

          }

            var val_id = res.recordset[0]["id"]

            for (const key in req.body.Fix["Attributes"]) {
              var string = (`INSERT INTO Attribute (FIX_ID, Attr, Val) VALUES (${val_id}, ${key}, '${req.body.Fix["Attributes"][key]}');`);


              sql.query(string, function (err, res) {

                 if (err){
                    console.log(err)
                    return callbackTot( err, {"results" : "ERROR: there was an error in chargingstation_table"});

                 }




              })


            }

              search_query = `
        SELECT a.*,
            (SELECT c.Alias, b.val, b.Attr
                FROM Attribute b
                INNER JOIN Attr_Aliases c
                ON b.Attr = c.Attr_ID
                WHERE a.ID=b.FIX_ID and a.Version = c.Version 
                FOR JSON PATH
            ) obj
            FROM Fix_messages a  WHERE a.ID = '`+val_id+`'`
            
                sql.query(search_query, function (err, res) {

                  if (err){
                    return callbackTot( err, {"results" : "ERROR: there was an error in chargingstation_table"});

                  }
                    return callbackTot( null, {"results" : res.recordset});

                })

        })

    })

    
  },
  
  

  
};





























