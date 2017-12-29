(function () {
	angular.module("examinee_module").service("ExamineeService", ["$http","$rootScope","$q",function($http, $rootScope, $q) {
		this.getAssessments = function() {
			var deferred = $q.defer();
			//result contain json with headers
			$http.get("http://localhost:3000/assessments").then(function(result) {
				deferred.resolve(result);
			},
			function(result) {
				deferred.reject(result);
			});
			return deferred.promise;
		}
		this.getDistributionData = function() {
			var deferred = $q.defer();
			//result contain json with headers
			$http.get("http://localhost:3000/distribution?userid="+$rootScope.globals.id).then(function(result) {
				deferred.resolve(result);
			},
			function(result) {
				deferred.reject(result);
			});
			return deferred.promise;
		}
		this.getTestData = function(distributionData) {
			var deferred = $q.defer();
			//console.log(distributionData.length);
			//result contain json with headers
			$http.get("http://localhost:3000/tests?id=" + distributionData.testsid).then(function(result) {
				deferred.resolve(result);
			},
			function(result) {
				deferred.reject(result);
			});
			return deferred.promise;
		}
		this.getAssessmentData = function(testData) {
			var deferred = $q.defer();
			//result contain json with headers
			$http.get("http://localhost:3000/assessments?id=" + testData.assessmentid).then(function(result) {
				deferred.resolve(result);
			},
			function(result) {
				deferred.reject(result);
			});
			return deferred.promise;
		}
		this.logout = function() {
			delete $cookieStore['globals'];
			delete $rootScope.tableformate;
		}
	}]);
})();
