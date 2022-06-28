angular.module('thesisStudy', ['ngRoute']);

angular.module('thesisStudy').config(function($routeProvider) {
    let version = "1.0.2";

    $routeProvider
        .when("/", {
            templateUrl: "intro.html?v=" + version,
            controller: "IndexCtrl"
        })
        .when("/photoReview", {
            templateUrl: "photoReview.html?v=" + version,
            controller: "IndexCtrl"
        })
        .when("/conclusion", {
            templateUrl: "conclusion.html?v=" + version,
            controller: "IndexCtrl"
        })
        .when("/results", {
            templateUrl: "results.html?v=" + version,
            controller: "ResultsCtrl"
        })
});

// Example given by user holographic-principle
// https://stackoverflow.com/questions/15207788/calling-a-function-when-ng-repeat-has-finished
angular.module('thesisStudy').directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit(attr.onFinishRender);
                });
            }
        }
    }
});