angular.module('thesisStudy').controller('ResultsCtrl', function ($scope, $http, $routeParams, $location) {
    $scope.data.raw = {};
    $scope.data.aggregated = {
        labels: [],
        datasets: [{
            label: 'Average Rating',
            data:[],
            backgroundColor: []
        }]
    };
    $scope.data.photos = {};
    $scope.data.individualPhotos = [];
    $scope.data.individualSessions = {};
    $scope.data.individualSessionIDs = [];
    $scope.base = $('base').prop('href');

    //
    let stringToColor = function(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        let color = '#';
        for (let i = 0; i < 3; i++) {
            let value = (hash >> (i * 8)) & 0xFF;
            color += ('00' + value.toString(16)).substr(-2);
        }
        return color;
    }

    $http.get($scope.base+"ajax/fetchRawData.php")
        .then(function (response) {
            if (response.data) {
                $scope.data.raw = response.data;
                response.data.forEach(function (row, index) {
                    if (!$scope.data.individualPhotos[row.imageID]) {
                        $scope.data.individualPhotos[row.imageID] = {
                            imageID: row.imageID,
                            title: row.title,
                            link: row.link,
                            ratings: [
                                {
                                    x: '1', y: 0
                                },
                                {
                                    x: '2', y: 0
                                },
                                {
                                    x: '3', y: 0
                                },
                                {
                                    x: '4', y: 0
                                },
                                {
                                    x: '5', y: 0
                                }
                            ],
                            problems: [
                                {
                                    x: 'Too dark', y: 0
                                },
                                {
                                    x: 'Blurry or unclear', y: 0
                                },
                                {
                                    x: 'Poorly prepared or cooked', y: 0
                                },
                                {
                                    x: 'Unappealing', y: 0
                                },
                                {
                                    x: 'Other', y: 0
                                }
                            ],
                            reasons: [],
                        };
                    }
                    $scope.data.individualPhotos[row.imageID].ratings[parseInt(row.rating)-1].y++;
                    if (row.problem > 0)
                        $scope.data.individualPhotos[row.imageID].problems[parseInt(row.problem)-1].y++;
                    if (row.reason.length > 0)
                        $scope.data.individualPhotos[row.imageID].reasons.push(row.reason);

                    if (!$scope.data.individualSessions[row.sessionID]) {
                        $scope.data.individualSessionIDs.push(row.sessionID);
                        $scope.data.individualSessions[row.sessionID] = {
                            sessionID: row.sessionID,
                            totalRatings: 0,
                            ratings: [
                                {
                                    x: '1', y: 0
                                },
                                {
                                    x: '2', y: 0
                                },
                                {
                                    x: '3', y: 0
                                },
                                {
                                    x: '4', y: 0
                                },
                                {
                                    x: '5', y: 0
                                }
                            ],
                            problems: [
                                {
                                    x: 'Too dark', y: 0
                                },
                                {
                                    x: 'Blurry or unclear', y: 0
                                },
                                {
                                    x: 'Poorly prepared or cooked', y: 0
                                },
                                {
                                    x: 'Unappealing', y: 0
                                },
                                {
                                    x: 'Other', y: 0
                                }
                            ],
                        };
                    }
                    $scope.data.individualSessions[row.sessionID].ratings[parseInt(row.rating)-1].y++;
                    $scope.data.individualSessions[row.sessionID].totalRatings++;
                    if (row.problem > 0)
                        $scope.data.individualSessions[row.sessionID].problems[parseInt(row.problem)-1].y++;
                });
            } else {
                alert("No data retrieved");
            }
        });

    $http.get($scope.base+"ajax/fetchAggregatedData.php")
        .then(function (response) {
            if (response.data) {
                $scope.data.photos = response.data;
                response.data.forEach(function (row, index) {
                    $scope.data.aggregated.labels.push(row.title);
                    $scope.data.aggregated.datasets[0].data.push({
                        y: parseInt(row.imageID),
                        x: parseFloat(row.imageRating)
                    });
                    $scope.data.aggregated.datasets[0].backgroundColor.push(stringToColor(row.title));
                });
                $scope.data.aggConfig = {
                    type: 'bar',
                    data: $scope.data.aggregated,
                    options: {
                        indexAxis: 'y',
                        plugins: {
                            legend: {
                                display: false
                            },
                            title: {
                                display: true,
                                text: 'Average Ratings'
                            }
                        },
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Stars'
                                }
                            }
                        }
                    }
                };

                $scope.data.myChart = new Chart(
                    $('#firstChart'),
                    $scope.data.aggConfig
                );
            } else {
                alert("No data retrieved");
            }
        });

    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
        $scope.data.photos.forEach(function (image, imageID) {
            $scope.data.individualPhotos[image.imageID].averageRating = image.imageRating;
            $scope.data.individualPhotos[image.imageID].numRatings = image.numRatings;
        });
        $scope.data.individualPhotos.forEach(function (image, imageID) {
            let cfg = {
                type: 'bar',
                data: {
                    labels: ['1', '2', '3', '4', '5'],
                    datasets: [{
                        label: 'Ratings',
                        data: image.ratings,
                        backgroundColor: stringToColor(image.title)
                    }]
                },
                options: {
                    plugins: {
                        legend: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: 'Ratings'
                        }
                    },
                    // maintainAspectRatio: false,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Stars'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: '# of Ratings'
                            }
                        }
                    }
                }
            };

            $scope.data.myChart = new Chart(
                $('#photo-' + imageID + '-ratings'),
                cfg
            );


            let cfg2 = {
                type: 'bar',
                data: {
                    labels: ['Too dark', 'Blurry or unclear', 'Poorly prepared or cooked', 'Unappealing', 'Other'],
                    datasets: [{
                        label: 'Problems',
                        data: image.problems,
                        backgroundColor: stringToColor(image.title)
                    }]
                },
                options: {
                    plugins: {
                        legend: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: 'Problems'
                        }
                    },
                    // maintainAspectRatio: false,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Problem'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: '# of Ratings'
                            }
                        }
                    }
                }
            };

            $scope.data.myChart = new Chart(
                $('#photo-' + imageID + '-problems'),
                cfg2
            );
        });

        $scope.data.individualSessionIDs.forEach(function (sessionID, index) {
            let cfg = {
                type: 'bar',
                data: {
                    labels: ['1', '2', '3', '4', '5'],
                    datasets: [{
                        label: 'Ratings',
                        data: $scope.data.individualSessions[sessionID].ratings,
                        backgroundColor: stringToColor(sessionID)
                    }]
                },
                options: {
                    plugins: {
                        legend: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: 'Ratings'
                        }
                    },
                    // maintainAspectRatio: false,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Stars'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: '# of Ratings'
                            }
                        }
                    }
                }
            };

            $scope.data.myChart = new Chart(
                $('#session-' + sessionID + '-ratings'),
                cfg
            );


            let cfg2 = {
                type: 'bar',
                data: {
                    labels: ['Too dark', 'Blurry or unclear', 'Poorly prepared or cooked', 'Unappealing', 'Other'],
                    datasets: [{
                        label: 'Problems',
                        data: $scope.data.individualSessions[sessionID].problems,
                        backgroundColor: stringToColor(sessionID)
                    }]
                },
                options: {
                    plugins: {
                        legend: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: 'Problems'
                        }
                    },
                    // maintainAspectRatio: false,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Problem'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: '# of Ratings'
                            }
                        }
                    }
                }
            };

            $scope.data.myChart = new Chart(
                $('#session-' + sessionID + '-problems'),
                cfg2
            );
        });
    });
});