(function(){

	angular.module("admin_module",["ngCookies", "ngTable"]);

	// controller for page as viewed by admin
	angular.module("admin_module").controller("AdminViewController", ["AdminService","$location","$scope","$rootScope",function(AdminService, $location, $scope, $rootScope){
		// default page view for admin
		$scope.showQuestionAdder = false;
		$scope.showAssessmentAdder = true;
		$scope.showUploadFile = false;
		$scope.showExamReport = false;
		$scope.showUploadFile = false;
		$scope.showAssessmentAddSuccess = false;
		$scope.showQuestionAddSuccess = false;
		$scope.showTestCreationSuccess = false;
		$scope.showUploadQuesFileSuccess = false;
		$scope.showUploadStudentFileSuccess = false;

		// change admin page view on manually adding question successfully
		$scope.viewQuestionAdder = function(){
			$scope.showQuestionAdder = true;
			$scope.showAssessmentAdder = false;
			$scope.showUploadFile = false;
			$scope.showExamReport = false;
			$scope.showTestCreator = false;
			$scope.showAssessmentAddSuccess = false;
			$scope.showQuestionAddSuccess = false;
			$scope.showTestCreationSuccess = false;
			$scope.showUploadQuesFileSuccess = false;
			$scope.showUploadStudentFileSuccess = false;
			$rootScope.$broadcast("clear_all_messages");
		}

		// change admin page view on manually creating assessment successfully
		$scope.viewAssessmentAdder = function(){
			$scope.showQuestionAdder = false;
			$scope.showAssessmentAdder = true;
			$scope.showUploadFile = false;
			$scope.showExamReport = false;
			$scope.showTestCreator = false;
			$scope.showAssessmentAddSuccess = false;
			$scope.showQuestionAddSuccess = false;
			$scope.showTestCreationSuccess = false;
			$scope.showUploadQuesFileSuccess = false;
			$scope.showUploadStudentFileSuccess = false;
			$rootScope.$broadcast("clear_all_messages");
		}

		$scope.viewUploadFile = function(){
			$scope.showUploadFile = true;
			$scope.showQuestionAdder = false;
			$scope.showAssessmentAdder = false;
			$scope.showExamReport = false;
			$scope.showTestCreator = false;
			$scope.showAssessmentAddSuccess = false;
			$scope.showQuestionAddSuccess = false;
			$scope.showTestCreationSuccess = false;
			$scope.showUploadQuesFileSuccess = false;
			$scope.showUploadStudentFileSuccess = false;
			$rootScope.$broadcast("clear_all_messages");
		}

		// change admin page view on scheduling a test successfully
		$scope.viewTestCreator = function(){
			$scope.showQuestionAdder = false;
			$scope.showAssessmentAdder = false;
			$scope.showUploadFile = false;
			$scope.showExamReport = false;
			$scope.showTestCreator = true;
			$scope.showAssessmentAddSuccess = false;
			$scope.showQuestionAddSuccess = false;
			$scope.showTestCreationSuccess = false;
			$scope.showUploadQuesFileSuccess = false;
			$scope.showUploadStudentFileSuccess = false;
			$rootScope.$broadcast("clear_all_messages");
		}

		$scope.viewExamReport = function(){
			$scope.showQuestionAdder = false;
			$scope.showAssessmentAdder = false;
			$scope.showUploadFile = false;
			$scope.showExamReport = true;
			$scope.showTestCreator = false;
			$scope.showAssessmentAddSuccess = false;
			$scope.showQuestionAddSuccess = false;
			$scope.showTestCreationSuccess = false;
			$scope.showUploadQuesFileSuccess = false;
			$scope.showUploadStudentFileSuccess = false;
			$rootScope.$broadcast("clear_all_messages");
		}

		// alert message on adding assessment
		$scope.$on("new_assessment_added_evt",function(){
			$scope.showAssessmentAddSuccess = true;
			$scope.successMessage = "Assessment added successfully !";
		});

		// alert message on adding question
		$scope.$on("new_question_added_evt",function(){
			$scope.showQuestionAddSuccess = true;
			$scope.successMessage = "Question added successfully !";
		});

		// alert message on uploading questions file
		$scope.$on("new_quesupload_added_evt",function(){
			$scope.showUploadQuesFileSuccess = true;
			$scope.successMessage = "Questions File uploaded successfully !";
		});

		// alert message on uploading students list file
		$scope.$on("new_studupload_added_evt",function(){
			$scope.showUploadStudentFileSuccess = true;
			$scope.successMessage = "Students list File uploaded successfully !";
		});

		// alert message on scheduling a new test
		$scope.$on("new_test_scheduled_evt",function(){
			$scope.showTestCreationSuccess = true;
			$scope.successMessage = "Test scheduled successfully !";
		});

		// clear any success messages if test creation failed
		$scope.$on("cannot_schedule_test",function(){
			$scope.showTestCreationSuccess = false;
		});
	}]);

	// controller for the view that schedules a test
	angular.module("admin_module").controller("TestCreatorController", ["AdminService","$location","$scope","$rootScope",function(AdminService, $location, $scope, $rootScope){

		// exam can not be scheduled or notified on a passed date
		// Limits on dates
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1;
		var yyyy = today.getFullYear();

		if(dd<10){
			dd='0'+dd
		}
		if(mm<10){
			mm='0'+mm
		}

		today = yyyy+'-'+mm+'-'+dd;
		document.getElementById("examDate").setAttribute("min", today);
		document.getElementById("notificationDate").setAttribute("min", today);

		// set default test duration to 5 minutes
		$scope.duration = 5;

		// get list of available assessments (set if questions) from json file
		AdminService.getAssessments().then(function(result){
			$scope.assessments  = result.data;
		});

		// update assessment dropdown menu on adding new assessment
		$scope.$on("new_assessment_added_evt",function(){
			AdminService.getAssessments().then(function(result){
				$scope.assessments  = result.data;
			});
		});

		// get list of users from json file
		var users = [];
		AdminService.getUsers().then(function(result){
			// filter out admin users
			angular.forEach(result.data, function(user){
				if(user.role !== "admin"){
					users.push(user);
				}
			});

			// populate the current list of users in the view
			$scope.users  = users

			// every user is initially not selected
			angular.forEach(users, function(user){
				user.checked = -1;
			});
		});

		// function to modify duration
		$scope.changeTime = function(quantum){
			$scope.duration = parseInt($scope.duration,10) + quantum;
			console.log($scope.duration);
			if($scope.duration < 5){
				$scope.duration = 5;
			}
			if($scope.duration > 60){
				$scope.duration = 60;
			}
		}

		// to hide / show error message when user is not selected for examination scheduling
		$scope.setUserNotEnteredError = function(setTo, msg){
			$scope.userNotSelected = setTo;
			$scope.message = msg;
		}

		// to clear all alert messages on catching event
		$scope.$on("clear_all_messages", function(){
			$scope.userNotSelected = false;
			$scope.selectedAssessment = "";
			$scope.duration = 5;
		});

		// defualt exam date and notification date = Today's date
		$scope.examDate = new Date();
		$scope.notificationDate = $scope.examDate;

		// function to add examination
		$scope.addExamination = function(){
			// unique test id = epoch timestamp of the time when test is created
			var testId = (new Date()).getTime();

			var noOfQuestions = 0;
			var chosenUsers = 0;
			AdminService.getNoOfQuestions($scope.selectedAssessment).then(function(result){
				// get no of questions in exam
				noOfQuestions = result.data.length;

				// check for each user in userlist, if user is chosen for exam
				angular.forEach(users, function(user){
					var isRegistered = user.checked;
					if(isRegistered !== -1){
						// maintain a count of chosen users
						chosenUsers = chosenUsers + 1;
						// if user is chosen, schedule an exam for the user
						AdminService.addDistribution(testId, isRegistered, "incomplete", 0, noOfQuestions, 0);
						// deselect the user after scheduling exam
						user.checked = -1;
					}
				});

				// if no user selected for exam
				if(chosenUsers === 0){

					// generate error alert message
					$scope.setUserNotEnteredError(true, "Select at least one user !");

					// broadcast failure message to all
					$rootScope.$broadcast("cannot_schedule_test");
					return;
				} else {
					// if some user selected for exam
					// don't show error alert
					$scope.userNotSelected = false;

					// add an exam to list of examinations
					AdminService.addTest(testId, $scope.examDate, $scope.notificationDate, $scope.selectedAssessment, $scope.duration);

					// reset fields of view to schedule another examination
					$scope.selectedAssessment = "";
					$scope.duration = "5";

					// notify all the views about new scheduled examination
					$rootScope.$broadcast("new_test_scheduled_evt");
				}

			});

		}

		$scope.sampleStudFile = false;

		$scope.showStudentSample = function(){
			$scope.sampleStudFile = !$scope.sampleStudFile;
		}

		$scope.uploadStudentFile = function(){
			var files = document.getElementById('fileStudent').files;
			if (!files.length) {
				alert('Please select a file!');
				return;
			}
			var file = files[0];
			$scope.filename = file.name;
			var reader = new FileReader();

			var emails = [];
			reader.readAsText(file);

			reader.onloadend = function(evt) {
				if (evt.target.readyState == FileReader.DONE) {
					var data = evt.target.result;
					// console.log(data);
					var allTextLines = data.split(/\r\n|\n/);
					var headers = allTextLines[0].split(',');
					// console.log(headers);
					// console.log(allTextLines.length);
					for(var i = 0; i < allTextLines.length; i++) {
						// console.log(allTextLines[i].split(','));
						rowElements= allTextLines[i].split(',');
						emails.push(rowElements);
					}

					console.log(emails[0][0]);

					angular.forEach(users, function(user) {
						for(var j = 0; j < emails.length; j++) {
							if(emails[j][0] === user.email) {
								user.checked = user.id;
								// console.log("email:" + emails[j][0] + " " + user.email);
								// console.log("id:" + user.id);
								// console.log("checked:" + user.checked);
							}
						}
					});
					// notify all views about uploaded students list file
			    	$rootScope.$broadcast("new_studupload_added_evt");
				}
			}
		}
	}]);

	// controller for the view to add questions manually
	angular.module("admin_module").controller("AddQuestionController",["AdminService","$location","$scope","$rootScope",function(AdminService, $location, $scope, $rootScope){
		// clear all the fields of the view
		$scope.question = "";
		$scope.optionOne = "";
		$scope.optionFour = "";
		$scope.optionTwo = "";
		$scope.optionThree = "";
		$scope.correctOption = "";

		// function to add question to assessment manually
		$scope.addQuestion = function(){
			// add question
			AdminService.addQuestion($scope.selectedAssessment, $scope.question, $scope.optionOne, $scope.optionTwo, $scope.optionThree, $scope.optionFour,$scope.correctOption);

			// notify all views about new question added
			$rootScope.$broadcast("new_question_added_evt");

			// reset all the fields of the view to add another question
			$scope.question = "";
			$scope.optionOne = "";
			$scope.optionFour = "";
			$scope.optionTwo = "";
			$scope.optionThree = "";
			$scope.correctOption = "";
		}

		// function to get list of assessments from json file
		AdminService.getAssessments().then(function(result){
			$scope.assessments  = result.data;
		});

		// update assessment list when new assessment is added
		$scope.$on("new_assessment_added_evt",function(){
			AdminService.getAssessments().then(function(result){
				$scope.assessments  = result.data;
			});
		});

	}]);

	// controller for the view to add new assessments manually
	angular.module("admin_module").controller("AddAssessmentController",["AdminService","$location","$scope","$rootScope",function(AdminService, $location, $scope, $rootScope){
		$scope.assessmentName = "";
		// function to create new assessment
		$scope.addAssessment = function(){
			// add assessment
			AdminService.addAssessment($scope.assessmentName);
			// notify all the views about new assessment added
			$rootScope.$broadcast("new_assessment_added_evt");
			// reset fields of the view to create new assessment
			$scope.assessmentName = "";
		}
	}]);

	angular.module("admin_module").controller("UploadFileController",["AdminService","$location","$scope", "$rootScope", function(AdminService, $location, $scope, $rootScope){

		AdminService.getAssessments().then(function(result){
			$scope.assessments  = result.data;
		});

		$scope.sampleQuesFile = false;

		$scope.showSample = function(){
			$scope.sampleQuesFile = !$scope.sampleQuesFile;
		}

		$scope.uploadFile = function(){

			var files = document.getElementById('fileInput').files;
			if (!files.length) {
				alert('Please select a file!');
				return;
			}
			var file = files[0];
			$scope.filename = file.name;
			var reader = new FileReader();

			reader.onloadend = function(evt) {
				if (evt.target.readyState == FileReader.DONE) {
					var data = evt.target.result;
					// console.log(data);
					var allTextLines = data.split(/\r\n|\n/);
					var headers = allTextLines[0].split(',');
					// console.log(headers);
					console.log(allTextLines.length);
					for(var i = 0; i < allTextLines.length - 1; i++) {

						// console.log(allTextLines[i].split(','));

						rowElements= allTextLines[i].split(',');

						question = rowElements[0];
						optionOne = rowElements[1];
						optionTwo = rowElements[2];
						optionThree = rowElements[3];
						optionFour = rowElements[4];
						correctOption = rowElements[5];
						AdminService.addQuestion($scope.selectedAssessment, question, optionOne, optionTwo, optionThree, optionFour, correctOption);
					}
				}
				// notify all views about uploaded questions file
				$rootScope.$broadcast("new_quesupload_added_evt");			
			}
			reader.readAsText(file);

		}



		// update assessment dropdown menu on adding new assessment
		$scope.$on("new_assessment_added_evt",function(){
			AdminService.getAssessments().then(function(result){
				$scope.assessments  = result.data;
			});
		});
	}]);

	angular.module("admin_module").controller("ExamReportController",["NgTableParams","AdminService","$location","$scope","$rootScope",function(NgTableParams, AdminService, $location, $scope, $rootScope){

		$scope.showChart=false;
		$scope.showTable=false;

		minDate = '2010-01-01';
		document.getElementById("fromDate").setAttribute("min", minDate);
		document.getElementById("toDate").setAttribute("min", minDate);

		$scope.fromDate = new Date();
		$scope.toDate = $scope.fromDate;
		AdminService.getAssessments().then(function(assessments_){
			$scope.assessments  = assessments_.data;
		});

		// update assessment dropdown menu on adding new assessment
		$scope.$on("new_assessment_added_evt",function(){
			AdminService.getAssessments().then(function(assessments_){
				$scope.assessments  = assessments_.data;
			});
		});



		$scope.showStudents = function(){
			$scope.showChart = false;
			$scope.showTable = false;
			$scope.results = [];

			AdminService.getTests($scope.selectedAssessment).then(function(tests_){
				var tests = tests_.data;
				console.log(tests);

				angular.forEach(tests, function(test) {

					// console.log(test);
					// console.log(test.examDate);

					console.log(new Date(fromDate));
					console.log(new Date(toDate));
					var examDate = new Date(test.examDate);
					console.log(examDate);

					if ($scope.fromDate <= examDate && examDate <= $scope.toDate) {
						AdminService.getDistributions(test.id).then(function(distributions_){
							$scope.distributions = distributions_.data;

							console.log($scope.distributions);

							angular.forEach($scope.distributions, function(distribution){

								console.log("Userid: " + distribution.userid);
								AdminService.getUser(distribution.userid).then(function(student_){
									var student = student_.data;
									var person = {
										'id': student[0].id,
										'name': student[0].firstName + " " + student[0].lastName,
										'email': student[0].email,
										'score': distribution.score,
										'status': distribution.status,
										'totalQuestionsCount': distribution.totalQuestionsCount,
										'questionAnswered': distribution.questionAnswered,
										'gender': student[0].gender,
										'performance': distribution.performance,
										'distID' : distribution.id
									};
									console.log("Name: " + person.name + " Email: " + person.email + " Score: " + person.score + " Status: " + person.status);
									$scope.results.push(person);
								});
							});
						});
					} else {
						return;
					}
				});
				$scope.showTable = true;
			});
		}

		$scope.sort = function(keyname){
			$scope.sortKey = keyname;   //set the sortKey to the param passed
			$scope.reverse = !$scope.reverse; //if true make it false and vice versa
		}

		$scope.viewStudentReport = function(distributionID){
			var i = 0;
			angular.forEach($scope.results, function(result){
				if(distributionID === result.distID){
					$scope.selected = $scope.results[i];
				}
				i = i + 1;
			});

			console.log($scope.selected);

			google.charts.load('current', {'packages':['bar']});
			google.charts.setOnLoadCallback(drawStuff);

			function drawStuff() {
				var data = new google.visualization.arrayToDataTable([
					['Type', 'Value'],
					['Total Questions', $scope.selected.totalQuestionsCount],
					["Answered", $scope.selected.questionAnswered],
					["Correct", $scope.selected.score],
					["Incorrect", $scope.selected.totalQuestionsCount - $scope.selected.score]
				]);

				var options = {
					width: 400,
					height: 400,
					legend: { position: 'none' },
					chart: {
						title: $scope.selected.name,
						subtitle: "Performance" },
						axes: {
							x: {
								0: { side: 'top', label: 'Score: ' + $scope.selected.score + "/" + $scope.selected.totalQuestionsCount} // Top x-axis.
							}
						},
						bar: { groupWidth: "90%" }
					};

					var chart = new google.charts.Bar(document.getElementById('chart'));
					// Convert the Classic options to Material options.
					chart.draw(data, google.charts.Bar.convertOptions(options));

					document.getElementById("image").setAttribute("src", "../../image/" + $scope.selected.gender + ".jpg");

					$scope.showChart = true;
				};
			}

		}]);

	})();
