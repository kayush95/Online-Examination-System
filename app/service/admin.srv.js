(function(){
	angular.module('admin_module').service('AdminService', ["$http","$cookieStore","$rootScope","$q",function($http, $cookieStore, $rootScope, $q){
		this.addAssessment = function(assessmentName){
			var assessmentObj = {
				'name' : assessmentName
			};
			$http.post('http://localhost:3000/assessments/', assessmentObj);
		}

		this.addQuestion = function(assessmentId, question, optionOne, optionTwo, optionThree, optionFour, correctOption){
			var questionObj = {
				'assessmentid' : parseInt(assessmentId),
				'text' : question,
				'options' : [{'id':1,'text':optionOne},{'id':2,'text':optionTwo},{'id':3,'text':optionThree},{'id':4,'text':optionFour}],
				'correct' : parseInt(correctOption)
			};
			$http.post('http://localhost:3000/questions/', questionObj);
		}

		this.assessments = [];

		this.getAssessments = function(){
			var deferred = $q.defer();
			$http.get("http://localhost:3000/assessments").then(function(result){
				deferred.resolve(result);
			},
			function(result){
				deferred.reject(result);
			});
			return deferred.promise;
		}

		this.getDistributions = function(testsId){
			var deferred = $q.defer();
			$http.get("http://localhost:3000/distribution?testsid="+testsId).then(function(result){
				deferred.resolve(result);
			},
			function(result){
				deferred.reject(result);
			});
			return deferred.promise;
		}

		this.getUsers = function(){
			var deferred = $q.defer();
			$http.get("http://localhost:3000/users").then(function(result){
				deferred.resolve(result);
			},
			function(result){
				deferred.reject(result);
			});
			return deferred.promise;
		}

		this.getUser = function(userId){
			var deferred = $q.defer();
			$http.get("http://localhost:3000/users?id="+userId).then(function(result){
				deferred.resolve(result);
			},
			function(result){
				deferred.reject(result);
			});
			return deferred.promise;
		}


		this.getTests = function(selectedAssessment){
			var deferred = $q.defer();
			$http.get("http://localhost:3000/tests?assessmentid="+selectedAssessment).then(function(result){
				deferred.resolve(result);
			},
			function(result){
				deferred.reject(result);
			});
			return deferred.promise;
		}

		this.addTest = function(testId, examDate, notificationDate, assessmentId, duration){
			var testObj = {
				'id' : testId,
				'examDate' : examDate.getTime(),
				'notificationDate' : notificationDate.getTime(),
				'assessmentid' : parseInt(assessmentId),
				'duration' : duration
			}
			$http.post('http://localhost:3000/tests/', testObj);
		}

		this.getNoOfQuestions = function(assessmentId){
			var deferred = $q.defer();
			$http.get("http://localhost:3000/questions/?assessmentid="+assessmentId).then(function(result){
				deferred.resolve(result);
			},
			function(result){
				deferred.reject(result);
			});
			return deferred.promise;
		}

		this.addDistribution = function(testId, userId, status, score, totalQuestions, answeredQuestions){
			var distributionObj = {
				'testsid': testId,
				'userid' : userId,
				'status' : status,
				'score' : score,
				'totalQuestionsCount' : totalQuestions,
				'questionAnswered' : answeredQuestions
			}
		$http.post('http://localhost:3000/distribution/', distributionObj);
		}
	}])
})();
