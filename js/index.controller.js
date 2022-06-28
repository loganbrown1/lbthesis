angular.module('thesisStudy').controller('IndexCtrl', function ($scope, $http, $routeParams, $location) {
    $scope.data = {};
    $scope.data.currentPhoto = 1;
    $scope.data.currentPhotoID = 0;
    $scope.data.problem = "0";
    $scope.data.otherReason = '';
    $scope.data.showOtherReasonBox = false;
    $scope.data.isRated = false;
    $scope.debugLog = '';
    $scope.base = $('base').prop('href');
    $scope.isDisabled = true;

    if ($location.url() === '/conclusion') {
        $('body').addClass('confetti');
    } else {
        $('body').removeClass('confetti');
    }

    $http.get($scope.base+"ajax/fetchImages.php")
        .then(function (response) {
            if (response.data) {
                $scope.data.photoList = response.data;
                $scope.data.currentPhotoID = $scope.data.photoList[0]['imageID'];
                $scope.data.currentPhotoLocation = $scope.data.photoList[0]['link'];
                $scope.data.currentPhotoTitle = $scope.data.photoList[0]['title'];
            } else {
                alert("No images retrieved");
            }
        });

    $scope.isOther = function() {
        $scope.data.showOtherReasonBox = ($scope.data.problem === "5");
    }

    $scope.init = function () {
        $http.post($scope.base+"ajax/startSession.php", null)
            .then(function (response) {
                $location.path('/photoReview');
            });
    }

    $scope.returnToIntro = function () {
        $location.path('/');
    }

    $scope.advanceImage = function () {
        $scope.data.currentPhoto++;
        $scope.data.currentPhotoID = $scope.data.photoList[$scope.data.currentPhoto-1]['imageID'];
        $scope.data.currentPhotoLocation = $scope.data.photoList[$scope.data.currentPhoto-1]['link'];
        $scope.data.currentPhotoTitle = $scope.data.photoList[$scope.data.currentPhoto-1]['title'];
        $scope.data.problem = "0";
        $scope.data.otherReason = '';
        $scope.data.showOtherReasonBox = false;
        $scope.data.isRated = false;
        $('#submit-error').addClass('d-none');
    }

    $scope.submitRating = function () {
        let rating = $('#rating-1');

        if(rating.val() < 1) {
            $('#submit-error').removeClass('d-none');
            return;
        }

        if($scope.isDisabled) {
            // Fallback when posting is disabled
            rating.rating('reset');
            if($scope.data.currentPhoto < $scope.data.photoList.length) {
                $scope.advanceImage();
            }
            else {
                $location.path('/conclusion');
            }
        }
        else {
            // Save the rating
            $http.post($scope.base+"ajax/addRating.php", {
                'imageID': $scope.data.currentPhotoID,
                'ratingValue': val,
                'problem': $scope.data.problem,
                'reason': $scope.data.otherReason
            })
                .then(function (response) {
                    $('#rating-1').rating('reset');
                    if($scope.data.currentPhoto < $scope.data.photoList.length) {
                        $scope.advanceImage();
                    }
                    else {
                        $location.path('/conclusion');
                    }
                });
        }
    }

    $('#rating-1').rating({
        min: 0,
        max: 5,
        step: 1,
        size: 'lg',
        showClear: false,
        showCaption: false,
        animate: false
    });
});