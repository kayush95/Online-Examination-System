(function () {
	angular.module("directive_module",[]);
	angular.module("directive_module").directive("cardView", function() {
		return {
			restrict : 'EA',
			templateUrl : 'app/templ/card.templ.html',
			scope : {
				name : '=',
				date : '=',
				duration : '=',
				status : '=',
				takeAssessment : '&',
				showTakeAssessment : '&'
			}
		}
	});
})();
