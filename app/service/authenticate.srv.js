(function() {


	angular.module('authenticate_module').service('AuthenticationService', ["$http","$cookieStore","$rootScope",function($http, $cookieStore, $rootScope) {


		this.login = function(username, password, callback) {


			$http.get('http://localhost:3000/users').then(function(response) {
				var users = response.data;
				var response = {
					success : false,
					message: "username or password incorrect, try again!"
				};

				for (var i = 0; i < users.length; i++) {
					if(username === users[i].email && password === users[i].password){
						var memberSince = new Date(users[i].memberSince);
						var memberSinceDate = memberSince.toLocaleDateString();
						response = {
							success : true,
							user: {
								"id" : users[i].id,
								"firstName" : users[i].firstName,
								"lastName" : users[i].lastName,
								"email" : users[i].email,
								"role" : users[i].role,
								"gender" : users[i].gender,
						        "memberSince": memberSinceDate,
								"memberSinceRawDate": users[i].memberSince
							}
						};
						break;
					}
				}
				callback(response);
			});
		}

		this.signUp = function(user, callback) {

			$http.get('http://localhost:3000/users').then(function(response) {
				var users = response.data;
				var response = {
					success : false,
					message: "username or password incorrect, try again!"
				};

				for (var i = 0; i < users.length; i++) {
					if(user.email === users[i].email){
						response = {
							success : false,
							message: "Email already exists in database!"
						};
						callback(response);
						return;
					}
				}
				$http.post('http://localhost:3000/users',user);
				response = {
					success : true,
				};
				callback(response);
			});
		}



		this.setCredentials = function(user, role) {
			//angular specific
			$rootScope.globals = user;

			$cookieStore.put('globals', $rootScope.globals);
		}

		this.clearCredentials = function() {
			$rootScope.globals = {};
			$cookieStore.remove('globals');
			$rootScope.distributionId = -1;
		}
	}]);
})();
