(function() {
    	angular.module("examination_module").service("ExaminationService", ["$http","$rootScope","$q",function($http, $rootScope, $q){
            this.getDistribution = function(id) {
                var deferred = $q.defer();
                //result contain json with headers
                $http.get("http://localhost:3000/distribution/" + id).then(function(result) {
                    deferred.resolve(result);
                },
                function(result) {
                    deferred.reject(result);
                });
                return deferred.promise;
            }

            this.getTest = function(id) {
                var deferred = $q.defer();
                //result contain json with headers
                $http.get("http://localhost:3000/tests/" + id).then(function(result) {
                    deferred.resolve(result);
                },
                function(result) {
                    deferred.reject(result);
                });
                return deferred.promise;
            }

            this.getAssessment = function(id) {
                var deferred = $q.defer();
                //result contain json with headers
                $http.get("http://localhost:3000/assessments/" + id).then(function(result) {
                    deferred.resolve(result);
                },
                function(result) {
                    deferred.reject(result);
                });
                return deferred.promise;
            }

            this.getAssessmentQuestions = function(assessmentid){
                var deferred = $q.defer();
                //result contain json with headers
                $http.get("http://localhost:3000/questions?assessmentid=" + assessmentid).then(function(result) {
                    deferred.resolve(result);
                },
                function(result) {
                    deferred.reject(result);
                });
                return deferred.promise;
            }
            this.submitTest = function(questions, assessmentid, distribution, callback) {
                var totalQuestions = questions.length;
                var answeredQuestions = 0;
                var score = 0;
                var performance = "";
                $http.get("http://localhost:3000/questions?assessmentid=" + assessmentid).then(function(result) {
                    var questionsWithAnswers = result.data;
                    for (var i = 0; i < questions.length; i++) {
                        if(questions[i].answered){
                            answeredQuestions = answeredQuestions + 1;
                        }
                        if(questions[i].submittedChoice === questionsWithAnswers[i].correct){
                            score = score + 1;
                        }
                    }

                    var percentage = score/totalQuestions;
                    if(percentage >= 0.80){
                        performance = "Excellent";
                    }
                    else if(percentage < 0.30){
                        performance = "Poor";
                    }
                    else if(percentage <= 0.50){
                        performance = "Good";
                    }
                    else{
                        performance = "Very Good";
                    }
                    $http.put("http://localhost:3000/distribution/"+distribution.id, {
                        "testsid": distribution.testsid,
                        "userid": distribution.userid,
                        "status": "complete",
                        "score": score,
                        "totalQuestionsCount": totalQuestions,
                        "questionAnswered": answeredQuestions,
                        "performance": performance
                    });
                    callback();
                });


            }
        }]);
})();
