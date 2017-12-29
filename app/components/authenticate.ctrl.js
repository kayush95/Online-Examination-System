(function() {
    angular.module("authenticate_module",['ngCookies']);

    angular.module("authenticate_module").controller("LoginSignUpController", ["AuthenticationService","$location","$scope","$rootScope", function(AuthenticationService, $location, $scope, $rootScope) {
        $scope.user = {
            "email" : "",
            "password" : ""
        }

        $scope.newUser = {
            "email" : "",
            "password" : "",
            "firstName" : "",
            "lastName" : "",
            "role": "examinee",
            "gender": "male"
        }

        $scope.loginError = false;
        $scope.signUpError = false;
        $scope.errorMessage = "";

        $scope.showLogIn = true;
        $scope.showSignUp = false;


        $scope.login = function(){
            $rootScope.$broadcast("login_success");
            if(!validateEmail($scope.user.email)){
                $scope.errorMessage = "Email not valid!!";
                $scope.loginError = true;
                return;
            }

            AuthenticationService.login($scope.user.email, $scope.user.password, function(response) {
                if(response.success == true){
                    AuthenticationService.setCredentials(response.user);

                    if(response.user.role === "examinee"){
                        $location.path("/examinee");
                    }
                    else if(response.user.role === "admin"){
                        $location.path("/admin");
                    }

                } else{
                    $scope.errorMessage = response.message;
                    $scope.loginError = true;
                }
            });
        }

        $scope.signUp = function(){
            if($scope.newUser.firstName === "" || $scope.newUser.lastName === "" || $scope.newUser.password === ""){
                $scope.errorMessage = "Fields can't be left empty!!";
                $scope.signUpError = true;
                return;
            }
            if(!validateEmail($scope.newUser.email)){
                $scope.errorMessage = "Email not valid!!";
                $scope.signUpError = true;
                return;
            }
            // Still to write the logic on how to proceed after the successful sign up
            $scope.newUser.memberSince = (new Date()).getTime();
            AuthenticationService.signUp($scope.newUser, function(response) {
                if(response.success == true){
                    $scope.showLogIn = true;
                    $scope.showSignUp = false;
                    $scope.loginError = true;
                    $scope.signUpError = false;
                    $scope.errorMessage = "Signed Up successfully, sign in to continue!";
                } else{
                    $scope.errorMessage = response.message;
                    $scope.signUpError = true;
                }
            });
        }

        function validateEmail(email) {
            var atpos = email.indexOf("@");
            var dotpos = email.lastIndexOf(".");
            if (atpos<1 || dotpos<atpos+2 || dotpos+2>=email.length) {
                return false;
            }
            return true;
        }

        $scope.openSignUpPage = function() {
            $scope.showLogIn = false;
            $scope.showSignUp = true;
            $scope.loginError = false;
            $scope.signUpError = false;
            $scope.errorMessage = "";
        }

        $scope.openLogInPage = function() {
            $scope.showSignUp = false;
            $scope.showLogIn = true;
            $scope.loginError = false;
            $scope.signUpError = false;
            $scope.errorMessage = "";
        }
    }]);

    angular.module("authenticate_module").controller("LogoutController", ["AuthenticationService","$location","$scope","$rootScope",function(AuthenticationService, $location, $scope, $rootScope) {
        $scope.loggedInUser = $rootScope.globals;
        $scope.logout = function () {
            $(".modal-backdrop").hide();
            $("body").attr("class","modal-close");
            AuthenticationService.clearCredentials();
            $location.path("/");
        };

        $scope.takeAssessment = function() {
            $rootScope.$broadcast("begin_exam");
        };
    }]);
})();
