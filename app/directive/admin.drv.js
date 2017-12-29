(function(){
    angular.module('admin_module').service('fileUpload', ['$http', function ($http) {
      this.uploadFileToUrl = function(file, uploadUrl){
         var fd = new FormData();
         fd.append('file', file);
      
         $https:.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
         })
      
         .success(function(){
         })
      
         .error(function(){
         });
      }
    }]);

});