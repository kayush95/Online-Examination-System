(function() {
    var reg = angular.module("examinee_module", []);



    reg.controller("ExamineeData", ["ExamineeService","$location","$scope","$rootScope",function(ExamineeService, $location, $scope, $rootScope) {
        $scope.user = $rootScope.globals;
        $scope.distributionData = distributionData = [];
        $scope.performances = performances = [];
        var score;
        var selectOption = 0;
        ExamineeService.getDistributionData().then(function(result) {
            $scope.distributionData = distributionData = result.data;
            angular.forEach(distributionData, function(distribution) {
                var testData = [];
                var status = distribution.status;
                var performance = distribution.performance;
                //console.log(performance);
                if(status === "complete") {
                    $scope.performances.push(performance);
                    //console.log(performance);
                }
            });
            var poor = 0;
            var good = 0;
            var veryGood = 0;
            var excellent = 0;
            $scope.myChartObject = {};
            $scope.myChartObject.type = "PieChart";
            angular.forEach($scope.performances, function(performance) {
                //console.log("shilpi");
                if(performance === "Poor") {
                    poor = poor + 1;
                } else if (performance === "Good") {
                    good = good + 1;
                } else if (performance === "Very Good") {
                    veryGood = veryGood + 1;
                } else if (performance === "Excellent") {
                    excellent = excellent + 1;
                }
            });
            $scope.myChartObject.data = {
                "cols" : [
                    {
                        id: "p",
                        labels : "Performance",
                        type : "string"
                    },
                    {
                        id: "n",
                        labels: "Number",
                        type : "number"
                    }
                ],
                "rows" : [
                    {
                        c : [
                            {
                                v : "Poor"
                            },
                            {
                                v: poor
                            }
                        ]
                    },
                    {c : [
                        {v: "Good"},
                        {v : good}
                    ]},
                    {c : [
                        {v : "Very Good"},
                        {v : veryGood}
                    ]},
                    {c : [
                        {v: "Excellent"},
                        {v : excellent}
                    ]}
                ]};

                $scope.myChartObject.options = {
                    'title' : 'Overall Performance'
                };

            });
        }]);

        reg.controller("ExamineeAssessments", ["ExamineeService","$location","$scope","$rootScope",function(ExamineeService, $location, $scope, $rootScope) {
            $scope.distributionData = distributionData = [];
            $scope.assessments = assessments = [];
            $scope.showHeading = false;
            ExamineeService.getDistributionData().then(function(result) {
                $scope.distributionData = distributionData = result.data;
                var testData = [];
                angular.forEach(distributionData, function(data) {
                    var status = data.status;
                    var id = data.id;
                    if(status === "incomplete") {
                        ExamineeService.getTestData(data).then(function(result){
                            testData = [];
                            testData = result.data;
                            angular.forEach(testData, function(test) {
                                var rawDate = test.examDate;
                                var date = new Date(test.examDate);
                                var examDate = date.toLocaleDateString();
                                var duration = test.duration;
                                var notificationDate = test.notificationDate;
                                assessmentData = [];
                                ExamineeService.getAssessmentData(test).then(function(result) {
                                    assessmentData = result.data;
                                    var examName = assessmentData[0].name;
                                    var assessment = {
                                        "name" : examName,
                                        "examDate" : examDate,
                                        "duration" : duration,
                                        "status" : "Registered",
                                        "notificationDate" : notificationDate,
                                        "distributionId" : id,
                                        "rawDate" : rawDate
                                    }
                                    $scope.assessments.push(assessment);
                                });
                            });
                        });
                    }
                });
            });

            $scope.$on("begin_exam",function(){
                $rootScope.distributionId = $scope.distributionId;
                $(".modal-backdrop").hide();
                $("body").attr("class","modal-close");
                $location.path("/exam");
    		});

            $scope.openModalConfirmation = function(distributionId) {
                $('#takeAssessmentModal').modal('toggle');
                $scope.distributionId = distributionId;
            }

            $scope.showTakeAssessment = function(rawDate) {
                var examDate = new Date(rawDate);
                var nowDate = new Date;
                // console.log("examDate : " + rawDate + "   , nowDate : " + nowDate.getTime());
                if(rawDate <= nowDate.getTime()) {
                    return true;
                } else {
                    return false;
                }
            }
            $scope.showAssessment = function(notificationRawDate) {
                var notificationDate = new Date(notificationRawDate);
                var nowDate = new Date;
                if(notificationRawDate <= nowDate.getTime()) {
                    $scope.showHeading = true;
                    return true;
                } else {
                    return false;
                }
            }
        }]);

        reg.controller("ResultTablePagenation", ["ExamineeService","$location","$scope","$rootScope","$http",function(ExamineeService, $location, $scope, $rootScope, $http) {
            $scope.distributionData = distributionData = [];
            $scope.results = results = [];

            var score;
            var selectOption = 0;
            ExamineeService.getDistributionData().then(function(result) {
                $scope.distributionData = distributionData = result.data;
                angular.forEach(distributionData, function(distribution) {
                    var testData = [];
                    var status = distribution.status;
                    var score = distribution.score;
                    var performance = distribution.performance;
                    if(status === "complete") {
                        ExamineeService.getTestData(distribution).then(function(result) {
                            testData = result.data;
                            angular.forEach(testData, function(test) {
                                // console.log("User Id : " +distribution.userid);
                                // console.log("status : " + status);
                                var date = new Date(test.examDate);
                                var examDate = date.toLocaleDateString();
                                assessmentData = [];
                                ExamineeService.getAssessmentData(test).then(function(result) {
                                    assessmentData = result.data;
                                    var examName = assessmentData[0].name;
                                    selectOption = selectOption + 1;
                                    var result = {
                                        "name" : examName,
                                        "date" : examDate,
                                        "score" : score,
                                        "selectOption" : selectOption,
                                        "performance" : performance
                                    }
                                    //console.log(result);
                                    $scope.results.push(result);
                                    $scope.totalResults = $scope.results.length;
                                });
                            });
                        });
                    }
                })
            });
            $scope.sortKey = 'date';
            $scope.reverse = true;
            $scope.sort = function(keyname){
                $scope.sortKey = keyname;   //set the sortKey to the param passed
                $scope.reverse = !$scope.reverse; //if true make it false and vice versa
            }
            $scope.filterAssessments = function() {
                var filterAssessments = [];
                results.forEach(function(c) {
                    if(c.name.toUpperCase().indexOf($scope.searchAssessmentsText.toUpperCase()) >= 0
                    ||  c.performance.toUpperCase().indexOf($scope.searchAssessmentsText.toUpperCase()) >=0
                    ||  c.score.toString().toUpperCase().indexOf($scope.searchAssessmentsText.toUpperCase()) >=0
                    ||  c.date.toString().toUpperCase().indexOf($scope.searchAssessmentsText.toUpperCase()) >=0) {
                        filterAssessments.push(c);
                    }
                });
                $scope.results = filterAssessments;
            }
        }]);
    })();
