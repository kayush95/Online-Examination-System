(function() {
    angular.module("examination_module",['examinee_module']);

    angular.module("examination_module").controller("ExaminationController",["AuthenticationService","ExaminationService","$scope","$rootScope","$http","$location","$window",function(AuthenticationService, ExaminationService, $scope, $rootScope, $http, $location, $window) {
        console.log("In ExaminationController, assessmentID: " + $rootScope.distributionId);

        var windowElement = angular.element($window);
        windowElement.on('beforeunload', function (event) {
            if($rootScope.distributionId && $rootScope.distributionId > 0){
                $scope.submitTestOnRefresh();
                return "";
            }
        });

        $scope.questions = [];
        $scope.currentQuestionIndex = 0;
        $scope.answeredQuestions = 0;
        $scope.previousDisabled = true;
        $scope.nextDisabled = false;
        $scope.myFilter = {
        }

        $scope.questionsFilter = "All";
        $scope.loggedInUser = $rootScope.globals;
        ExaminationService.getDistribution($rootScope.distributionId).then(function(result) {
            $scope.distribution = result.data;
            ExaminationService.getTest($scope.distribution.testsid).then(function(result) {
                $scope.test = result.data;
                ExaminationService.getAssessment($scope.test.assessmentid).then(function(result) {
                    $scope.assessment = result.data;
                });
                ExaminationService.getAssessmentQuestions($scope.test.assessmentid).then(function(result) {
                    var questions = result.data;
                    for (var i = 0; i < questions.length; i++) {
                        $scope.questions.push({
                            "index" : i,
                            "text" : questions[i].text,
                            "options" : questions[i].options,
                            "submittedChoice" : -1,
                            "answered": false
                        });
                    }
                    $scope.totalQuestions = $scope.questions.length;
                    if($scope.totalQuestions === 1){
                        $scope.nextDisabled = true;
                    }
                    $scope.unansweredQuestions = $scope.totalQuestions;
                });
            });
        });
        $scope.optionSelected = function(currentQuestionIndex){
            if(!$scope.questions[currentQuestionIndex].answered){
                $scope.questions[currentQuestionIndex].answered = true;
                $scope.answeredQuestions = $scope.answeredQuestions + 1;
                $scope.unansweredQuestions = $scope.unansweredQuestions - 1;
            }
        }
        $scope.previous = function() {
            $scope.currentQuestionIndex = $scope.currentQuestionIndex - 1;
            if($scope.currentQuestionIndex === 0){
                $scope.previousDisabled = true;
            }
            $scope.nextDisabled = false;
        }
        $scope.next = function() {
            $scope.currentQuestionIndex = $scope.currentQuestionIndex + 1;
            if($scope.currentQuestionIndex === $scope.totalQuestions-1){
                $scope.nextDisabled = true;
            }
            $scope.previousDisabled = false;
        }

        $scope.questionsFilterChange = function() {
            if($scope.questionsFilter === "All"){
                $scope.myFilter = {
                }
            }
            else if($scope.questionsFilter === "Unanswered"){
                $scope.myFilter = {
                    answered : false
                }
            }
            else if($scope.questionsFilter === "Answered"){
                $scope.myFilter = {
                    answered : true
                }
            }
        }

        $scope.questionClicked = function(index) {
            $scope.currentQuestionIndex = index;
            $scope.previousDisabled = false;
            $scope.nextDisabled = false;
            if(index === 0){
                $scope.previousDisabled = true;
            }
            if(index === $scope.totalQuestions-1){
                $scope.nextDisabled = true;
            }
        }

        $scope.submitTest = function() {
            ExaminationService.submitTest($scope.questions, $scope.test.assessmentid, $scope.distribution, function() {
                $rootScope.distributionId = -1;
                $(".modal-backdrop").hide();
                $("body").attr("class","modal-close");
                $location.path("/examinee");
            });
        }

        $scope.submitTestOnRefresh = function() {
            ExaminationService.submitTest($scope.questions, $scope.test.assessmentid, $scope.distribution, function() { });
        }

        $scope.logout = function () {
            ExaminationService.submitTest($scope.questions, $scope.test.assessmentid, $scope.distribution, function() {
                $rootScope.distributionId = -1;
                $(".modal-backdrop").hide();
                $("body").attr("class","modal-close");
                AuthenticationService.clearCredentials();
                $location.path("/");
            });
        };
    }]);
})();
