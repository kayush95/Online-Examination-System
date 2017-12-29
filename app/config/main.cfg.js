(function() {
    //Add newly created modules as a dependency to the main module

    angular.module('main_module', ["googlechart", "examination_module", "angularUtils.directives.dirPagination", "directive_module", "authenticate_module","admin_module", "examinee_module", "ngRoute","ngCookies"]);


    angular.module("main_module").config(["$routeProvider","$locationProvider",function($routeProvider, $locationProvider) {

        $routeProvider.when('/',{
            templateUrl : '../app/page/login.html'
        }).when('/examinee',{
            templateUrl : '../app/page/examinee.html'
        }).when('/admin',{
            templateUrl : '../app/page/admin.html'
        }).when('/exam',{
            templateUrl : '../app/page/exam.html'
        }).otherwise('/');

    }]);

    angular.module("main_module").run(["$cookieStore","$location","$rootScope","$http",function($cookieStore, $location, $rootScope, $http) {

        $rootScope.$on("$locationChangeStart", function(event, next, current) {
            if($rootScope.distributionId && $rootScope.distributionId > 0){
                if($location.path() !== '/exam'){
                    event.preventDefault();
                }
            }
            console.log("next : " + next);
            var user = $cookieStore.get('globals');
            if(user){
                $rootScope.globals = user;
            }

            if($location.path() !== '/' && !user){
                $location.path('/');
            }

            if($location.path() === '/' && user){
                $rootScope.globals = user;
                if(user.role === "examinee"){
                    $location.path("/examinee");
                }
                else if(user.role === "admin"){
                    $location.path("/admin");
                }
            }

            if($location.path() === '/admin' && user.role !== 'admin'){
                $rootScope.globals = user;
                $location.path('/');
            }

            if($location.path() === '/examinee' || $location.path() === '/exam'){
                $rootScope.globals = user;
                if(user.role !== 'examinee'){
                    $location.path('/');
                }
                if($location.path() === '/exam'){
                    if(!($rootScope.distributionId) || $rootScope.distributionId <= 0){
                        $location.path('/');
                    }
                }
            }
        });
    }]);

})();
