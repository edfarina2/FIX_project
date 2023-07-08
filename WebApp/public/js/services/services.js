angular.module('Service', [])

.factory('server_operations', ['$http', '$filter' ,function($http, $filter) {
    return {
      
      get_fix_versions: function (){
        return $http.get('/api/get_fix_versions', {});
        
      },
      
      PopulateKey: function (val){
        return $http.post('/api/PopulateKey', {"val": val});

      },
      SearchByKey: function (val){
        return $http.post('/api/SearchByKey', {"val": val});

      },
      TradSystList: function (){
        return $http.get('/api/TradSystList', {});

      },
      TradSystSearch: function (val){
        console.log(val)
        return $http.post('/api/TradSystSearch', {"val": val});

      },
      TypeList: function (){
        return $http.get('/api/TypeList', {});

      },
      TypeSearch: function (val){
        return $http.post('/api/TypeSearch', {"val": val});

      },

      SaveFIX_Fragment: function (val){
        return $http.post('/api/SaveFIX_Fragment', {"val": val});

      },

      FillDBObj: function (val){
        return $http.post('/api/FillDBObj', {"Fix": val});

      },


      readDataAndSend: function(filename, file){
         return $http.post('/api/readDataAndSend', {"filename": filename, "file": file });

      }
      
    }
}])

.service('sharedProperties', function () {


});

