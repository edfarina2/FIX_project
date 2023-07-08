var sanitizer = require('sanitizer');
FIX_fragment = require('./fix_fragment.js')
var multer  = require('multer')
var uploads = multer({ dest: './Uploads/' })
const fs = require("fs");
const readline = require("readline");
module.exports = function(app, passport) {
  

    app.get('/mainpage',  function (req, res) {

        console.log(req.user)
        // app.use(express.static(path.join(__dirname, 'public')));
        app.engine('html', require('ejs').renderFile);
        res.render(__dirname + '/../public/mainpage.html', {
         
        });
           

    });

    app.get('/',  function (req, res) {

        console.log(req.user)
        // app.use(express.static(path.join(__dirname, 'public')));
        app.engine('html', require('ejs').renderFile);
        res.render(__dirname + '/../public/mainpage.html', {
         
        });
           

    });
    

    
//// UPLOAD STUFF
    //register on disk the photos to be register on DB
    app.post('/api/Upload', function (req, res) {
        upload(req, res, function (err) {
        if (err) {
            res.status(500).send(err.stack);
        return
        } else { 
            res.status(200).send('File(s) uploaded successfully');
        }
    })
    });

    app.post('/api/readDataAndSend', function (req, res) {
        

        lines = 0
        var resu = []

        input_path = "./public/Uploads/"+req.body.filename

        const allContents = fs.readFileSync(input_path, 'utf-8');
        lines_vec = allContents.split(/\r?\n/)
  // console.log('line: ', line);


        
        for (i=0; i<lines_vec.length-1; i++){

        lines+=1
        line = lines_vec[i]
        console.log(line)
        fix_fragment = new FIX_fragment();

        fix_fragment.Load_from_TradString(line)

        var chechsum_check = fix_fragment.Check_FIX_frag()
        var chechsum_length = fix_fragment.Check_FIX_frag_length()

        req.body.chechsum_check = chechsum_check
        req.body.chechsum_length = chechsum_length

        // console.log(fix_fragment.JSON_Frag())

        req.body.Fix = fix_fragment.JSON_Frag();
            
        resul=req.body.Fix
        resul["chechsum_check"] = req.body.chechsum_check
        resul["chechsum_length"] = req.body.chechsum_length


            resu.push(resul)

            // console.log(resu)

            // console.log(resu.length)

            // console.log(lines)

        
        
            
        
        };

        


            res.status(200).send(   resu);

        


    });



    app.get('/api/get_fix_versions',  function (req, res) {
        oracle_call.get_fix_versions(req, res, function(err, result){
            if (err){
                console.log('in /api/get_fix_versions: ' + err);
                res.status(504).send(err.message);
            } else {
                resu=result.results;
                res.status(200).send(   resu);

        }
        });
    });


    app.post('/api/PopulateKey',  function (req, res) {
        oracle_call.PopulateKey(req, res, function(err, result){
            if (err){
                console.log('in /api/PopulateKey: ' + err);
                res.status(504).send(err.message);
            } else {
                resu=result.results;
                res.status(200).send(   resu);

        }
        });
    });

    app.post('/api/SearchByKey',  function (req, res) {
        oracle_call.SearchByKey(req, res, function(err, result){
            if (err){
                console.log('in /api/SearchByKey: ' + err);
                res.status(504).send(err.message);
            } else {
                resu=result.results;
                res.status(200).send(   resu);

        }
        });
    });


    app.get('/api/TradSystList',  function (req, res) {
        oracle_call.TradSystList(req, res, function(err, result){
            if (err){
                console.log('in /api/TradSystList: ' + err);
                res.status(504).send(err.message);
            } else {
                resu=result.results;
                res.status(200).send(   resu);

        }
        });
    });

    app.post('/api/TradSystSearch',  function (req, res) {
        oracle_call.TradSystSearch(req, res, function(err, result){
            if (err){
                console.log('in /api/TradSystSearch: ' + err);
                res.status(504).send(err.message);
            } else {
                resu=result.results;
                res.status(200).send(   resu);

        }
        });
    });


    app.get('/api/TypeList',  function (req, res) {
        oracle_call.TypeList(req, res, function(err, result){
            if (err){
                console.log('in /api/TypeList: ' + err);
                res.status(504).send(err.message);
            } else {
                resu=result.results;
                res.status(200).send(   resu);

        }
        });
    });

    app.post('/api/TypeSearch',  function (req, res) {
        oracle_call.TypeSearch(req, res, function(err, result){
            if (err){
                console.log('in /api/TypeSearch: ' + err);
                res.status(504).send(err.message);
            } else {
                resu=result.results;
                res.status(200).send(   resu);

        }
        });
    });

    app.post('/api/FillDBObj',  function (req, res) {
        oracle_call.UploadFix(req, res, function(err, result){
            if (err){
                console.log('in /api/FillDBObj: ' + err);
                res.status(504).send(err.message);
            } else {
                resu=result.results;
                res.status(200).send(   resu);

        }
        });
    });



    
    app.post('/api/SaveFIX_Fragment',  function (req, res) {
        

        var string = ""
        if (req.body.val === undefined ){
            string = "8=FIX.4.2|9=65|35=A|49=SERVER|56=CLIENT|34=177|52=20090107-18:15:16|98=0|108=30|10=062|";

        }
        else {
            string = req.body.val
        }

        
        fix_fragment = new FIX_fragment(string);

        var chechsum_check = fix_fragment.Check_FIX_frag()
        var chechsum_length = fix_fragment.Check_FIX_frag_length()

        req.body.chechsum_check = chechsum_check
        req.body.chechsum_length = chechsum_length

        console.log(fix_fragment.JSON_Frag())

        req.body.Fix = fix_fragment.JSON_Frag();
        console.log(req.body)
        oracle_call.UploadFix(req, res, function(err, result){
        if (err){
            console.log('in /api/UploadFix: ' + err);
            res.status(504).send(err.message);
            } else {
            resu=result.results;
            resu[0]["chechsum_check"] = req.body.chechsum_check
            resu[0]["chechsum_length"] = req.body.chechsum_length

            console.log(resu)
            res.status(200).send(   resu);

        }
        });

    });


    
    
}