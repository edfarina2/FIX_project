angular.module('Controller', [])

// inject the server_operations service factory into our controller




.controller('MainController', ['$scope', 'FileUploader', '$uibModal', 'server_operations', '$timeout', '$window', '$mdDialog', '$location',  '$anchorScroll' , 'sharedProperties','NgTableParams', function ($scope, FileUploader, $uibModal, server_operations,  $timeout, $window, $mdDialog , $location , $anchorScroll , sharedProperties,  NgTableParams){

    $scope.a = "ciao"


    $scope.FixVersion = []
    $scope.selectFixVersion = ""

    $scope.KeyList = []
    $scope.SelectedKey = []

    $scope.listExpressK = []

    $scope.expr = ""

    $scope.listExpress = ""
    $scope.listExpressV = []


    $scope.fix_results = []

    $scope.TradSystList = []
    $scope.TradSystListSelected = ""

    $scope.TypeList = []
    $scope.TypeListSelected = ""

    $scope.fix_string = ""

    server_operations.get_fix_versions()
    .then(function successCallback(response) {
      $scope.FixVersion = response.data

      response.data.forEach( function (item, index, object){
         })

    })

    server_operations.TradSystList()
    .then(function successCallback(response) {
      $scope.TradSystList = response.data

 

    })

      server_operations.TypeList()
    .then(function successCallback(response) {
      $scope.TypeList = response.data

 

    })





    $scope.PopulateKey = function( ){
      

      server_operations.PopulateKey($scope.selectFixVersion["Version"])
      .then(function successCallback(response) {
        $scope.KeyList = response.data
        response.data.forEach( function (item, index, object){
        })

      })


    }


    $scope.cleanChoice = function( ){

      $scope.fix_results = []
      $scope.listExpressK = []
      $scope.listExpressV = []
      $scope.expr  = ""
      $scope.listExpress = ""

    }

    $scope.Search = function( ){

      $scope.fix_results = []

      server_operations.SearchByKey($scope.listExpressK)
      .then(function successCallback(response) {
        
        $scope.fix_results = response.data


      for (var i = 0 ; i< $scope.fix_results.length ;  i++) {
          $scope.fix_results[i].objJSON = JSON.parse($scope.fix_results[i].obj)
      }


      })

    }

    $scope.TradSystSearch = function( ){

      $scope.fix_results = []

      server_operations.TradSystSearch($scope.TradSystListSelected["TradSyst"])
      .then(function successCallback(response) {
        
        $scope.fix_results = response.data


      for (var i = 0 ; i< $scope.fix_results.length ;  i++) {
          $scope.fix_results[i].objJSON = JSON.parse($scope.fix_results[i].obj)
      }


      })

    }


    $scope.TypeSearch = function( ){

      $scope.fix_results = []

      server_operations.TypeSearch($scope.TypeSelected["Type"])
      .then(function successCallback(response) {
        
        $scope.fix_results = response.data


      for (var i = 0 ; i< $scope.fix_results.length ;  i++) {
          $scope.fix_results[i].objJSON = JSON.parse($scope.fix_results[i].obj)
      }


      })

    }




    $scope.SaveFixString  = function(ev ){

      $scope.fix_results = []

      server_operations.SaveFIX_Fragment($scope.fix_string)
      .then(function successCallback(response) {

     $scope.fix_results = response.data

     $scope.checksum_ver = response.data[0].chechsum_check
     $scope.length_ver = response.data[0].chechsum_length

     if ($scope.checksum_ver == true   && $scope.length_ver == true){


        var confirm = $mdDialog.alert()
       .title('Results')
       .textContent("Both checksum and length tests are passed")
       .targetEvent(ev)
       .ok('OK')
       $mdDialog.show(confirm).then(function() {

        }, function() {
        });
    }


if ($scope.checksum_ver == false   && $scope.length_ver == true){


        var confirm = $mdDialog.alert()
       .title('Results')
       .textContent("Length test is passed, but checksum NOT")
       .targetEvent(ev)
       .ok('OK')
       $mdDialog.show(confirm).then(function() {

        }, function() {
        });
    }



if ($scope.checksum_ver == true   && $scope.length_ver == false){


        var confirm = $mdDialog.alert()
       .title('Results')
       .textContent("Checksum test is passed, but length NOT")
       .targetEvent(ev)
       .ok('OK')
       $mdDialog.show(confirm).then(function() {

        }, function() {
        });
    }


if ($scope.checksum_ver == false   && $scope.length_ver == false){


        var confirm = $mdDialog.alert()
       .title('Results')
       .textContent("Both checksum and length tests are NOT passed")
       .targetEvent(ev)
       .ok('OK')
       $mdDialog.show(confirm).then(function() {

        }, function() {
        });
    }



      for (var i = 0 ; i< $scope.fix_results.length ;  i++) {
          $scope.fix_results[i].objJSON = JSON.parse($scope.fix_results[i].obj)
      }


      })


    }



    $scope.PopulateExpr = function( ){
      
     $scope.expr = ($scope.SelectedKey["Alias"])

    }

    $scope.AddRelation = function( ){
      
     $scope.listExpress += $scope.expr + "\n"
     var obj = {}

     obj["ID"] = $scope.SelectedKey["Attr_ID"]
     obj["Val"] = $scope.expr.replace(($scope.SelectedKey["Alias"]), "")

     $scope.listExpressK.push(  obj)
     $scope.listExpressV.push( $scope.expr ) 

    }



// UPLOADER
  


  var uploader = $scope.uploader = new FileUploader({
    url: '/api/Upload/',
    method: 'POST'
  });
  



  uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
      console.info('onWhenAddingFileFailed', item, filter, options);
  };
  uploader.onAfterAddingFile = function(fileItem) {
      console.info('onAfterAddingFile', fileItem);
  };
  uploader.onAfterAddingAll = function(addedFileItems) {
      console.info('onAfterAddingAll', addedFileItems);
  };
  uploader.onBeforeUploadItem = function(item) {
    // item.formData.push({complete_path: $rootScope.Path});


    console.info('onBeforeUploadItem', item);
  };
  uploader.onProgressItem = function(fileItem, progress) {
      console.info('onProgressItem', fileItem, progress);
  };
  uploader.onProgressAll = function(progress) {
      console.info('onProgressAll', progress);
  };
  uploader.onSuccessItem = function(fileItem, response, status, headers) {
      console.info('onSuccessItem', fileItem, response, status, headers);

     console.log(fileItem)
      server_operations.readDataAndSend(fileItem._file.name, fileItem.file)
    .then(function successCallback(data) {


             var res = data.data

              for (var i = 0 ; i< res.length ;  i++) {

              server_operations.FillDBObj(res[i])
              .then(function successCallback(data) {

                var data = data.data[0]
                data.objJSON = JSON.parse(data.obj)


                $scope.fix_results.push(data)


    
              })


            }



           }

           );
      

  };
  uploader.onErrorItem = function(fileItem, response, status, headers) {
      console.info('onErrorItem', fileItem, response, status, headers);

  
        $rootScope.$emit("CallAlert", ["danger", "Upload error on file: " +fileItem._file.name + " Reason: " + response ]);

       
  };
  uploader.onCancelItem = function(fileItem, response, status, headers) {
      console.info('onCancelItem', fileItem, response, status, headers);
  };
  uploader.onCompleteItem = function(fileItem, response, status, headers) {
      console.info('onCompleteItem', fileItem, response, status, headers);
  };
  uploader.onCompleteAll = function() {
      console.info('onCompleteAll');
  };

  console.info('uploader', uploader);


}])







