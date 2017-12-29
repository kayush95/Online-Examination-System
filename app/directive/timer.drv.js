
(function() {
    angular.module("examination_module").directive('examTimer', ['$interval', function($interval) {

        function link(scope, element, attrs) {

            var displayString, timeoutId, alertTimerId;
            var minutes;
            var seconds = 0;
            var alertTimer = false;
            var display = true;
            scope.$watch('duration', function(newVal, oldVal) {

                minutes = newVal;
                seconds = 0;
                updateTime();
            }, true);

            function updateTime() {
                displayString = minutes + " minutes\t" + seconds + " seconds";
                element.text(displayString);

            }

            element.on('$destroy', function() {
                $interval.cancel(timeoutId);
                if(alertTimer){
                    $interval.cancel(alertTimerId);
                }
            });

            // start the UI update process; save the timeoutId for canceling
            timeoutId = $interval(function() {
                if(minutes < 5 && !alertTimer){
                    element.css("font-size",15);
                    element.css("color","red");
                    alertTimerId = $interval(function () {
                        if(display){
                            element.css("visibility", "hidden");
                            display = false;
                        }
                        else{
                            element.css("visibility", "visible");
                            display = true;
                        }
                    }, 500);
                    alertTimer = true;
                }
                if(seconds === 0 && minutes ===0){
                    scope.submitTest();
                }
                else if(seconds === 0){
                    minutes = minutes - 1;
                    seconds = 59;
                }
                else{
                    seconds = seconds - 1;
                }
                updateTime(); // update DOM
            }, 1000);
        }

        return {
            restrict: 'AECM',
            link: link,
            scope: {
                duration: '=',
                submitTest: '&'
            }
        };
    }]);
})();
