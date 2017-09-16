angular.module('conFusion.controllers', [])

        .controller('AppCtrl', function ($scope, $ionicModal, $timeout, $localStorage, $ionicPlatform, $cordovaCamera, $cordovaImagePicker) {

          // With the new view caching in Ionic, Controllers are only called
          // when they are recreated or on app start, instead of every page change.
          // To listen for when this page is active (for example, to refresh data),
          // listen for the $ionicView.enter event:
          //$scope.$on('$ionicView.enter', function(e) {
          //});

          // login.html
          //Form data for the login modal
          // The initialization of loginData JavaScript object
          $scope.loginData = $localStorage.getObject('userinfo','{}');

          // Create the login modal that we will use later
          $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
          }).then(function(modal) {
            $scope.modal = modal;
          });

          // Triggered in the login modal to close it
          $scope.closeLogin = function() {
            $scope.modal.hide();
          };

          // Open the login modal
          $scope.login = function() {
            $scope.modal.show();
          };

          // Perform the login action when the user submits the login form
          $scope.doLogin = function() {
            console.log('Doing login', $scope.loginData);
          $localStorage.storeObject('userinfo',$scope.loginData);

            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function() {
              $scope.closeLogin();
            }, 1000);
          };

          // reserve.html
          // Form data for the reserve modal
          $scope.reservation = {};

          // Create the reserve modal that we will use later
          $ionicModal.fromTemplateUrl('templates/reserve.html', {
            scope: $scope
          }).then(function(modal) {
            $scope.reserveform = modal;
          });

          // Triggered in the reserve modal to close it
          $scope.closeReserve = function() {
            $scope.reserveform.hide();
          };

          // Open the reserve modal
          $scope.reserve = function() {
            $scope.reserveform.show();
          };

          // Perform the reserve action when the user submits the reserve form
          $scope.doReserve = function() {
            console.log('Doing reservation', $scope.reservation);

                // Simulate a reservation delay. Remove this and replace with your reservation
                // code if using a server system
                $timeout(function() {
                  $scope.closeReserve();
              }, 1000);
          };

          // register.html
          // An empty JavaScript variable
          $scope.registration = {};

          // Create the registration modal that we will use later
          $ionicModal.fromTemplateUrl('templates/register.html', {
              scope: $scope
          }).then(function (modal) {
              $scope.registerform = modal;
          });

          // Triggered in the registration modal to close it
          $scope.closeRegister = function () {
              $scope.registerform.hide();
          };

          // Open the registration modal
          $scope.register = function () {
              $scope.registerform.show();
          };

          // Perform the registration action when the user submits the registration form
          $scope.doRegister = function () {
              // Simulate a registration delay. Remove this and replace with your registration
              // code if using a registration system
              $timeout(function () {
                  $scope.closeRegister();
              }, 1000);
          };

          // Add Cordova camera plugin to use when click take a picture
          $ionicPlatform.ready(function() {
              var options = {
                  quality: 50,
                  destinationType: Camera.DestinationType.DATA_URL,
                  sourceType: Camera.PictureSourceType.CAMERA,
                  allowEdit: true,
                  encodingType: Camera.EncodingType.JPEG,
                  targetWidth: 100,
                  targetHeight: 100,
                  popoverOptions: CameraPopoverOptions,
                  saveToPhotoAlbum: false
              };

              $scope.takePicture = function() {
                  $cordovaCamera.getPicture(options).then(function(imageData) {
                      $scope.registration.imgSrc = "data:image/jpeg;base64," + imageData;
                  }, function(err) {
                      console.log(err);
                  });

                  $scope.registerform.show();

              };
          

          // Add Cordova image picker plugin to use when click gallery
          var optionsGallery = {
                   maximumImagesCount: 10,
                   width: 200,
                   height: 200,
                   quality: 80
            };

          $scope.gallery = function() {
                $cordovaImagePicker.getPictures(optionsGallery)
                  .then(function (results) {
                    for (var i = 0; i < results.length; i++) {
                      $scope.registration.imgSrc = results[i];
					  console.log('Image URI: ' + results[i]);
                    }
                  }, function(error) {
                      console.log(err);
                  });

                     $scope.registerform.show();

            };
          });
        })


    // menu.html
    .controller('MenuController', ['$scope', 'dishes', 'favoriteFactory', 'baseURL','$ionicListDelegate','$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', function ($scope, dishes, favoriteFactory, baseURL, $ionicListDelegate, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {

			      $scope.baseURL = baseURL;
            $scope.tab = 1;
            $scope.filtText = '';
            $scope.showDetails = false;
            $scope.showMenu = false;
            $scope.message = "Loading ...";

            $scope.dishes = dishes;

            $scope.select = function(setTab) {
                $scope.tab = setTab;

                if (setTab === 2) {
                    $scope.filtText = "appetizer";
                }
                else if (setTab === 3) {
                    $scope.filtText = "mains";
                }
                else if (setTab === 4) {
                    $scope.filtText = "dessert";
                }
                else {
                    $scope.filtText = "";
                }
            };

            $scope.isSelected = function (checkTab) {
                return ($scope.tab === checkTab);
            };

            $scope.toggleDetails = function() {
                $scope.showDetails = !$scope.showDetails;
            };

            $scope.addFavorite = function (index) {
                console.log("index is " + index);
                favoriteFactory.addToFavorites(index);
                $ionicListDelegate.closeOptionButtons();

            // Adding Cordova Plugin
            $ionicPlatform.ready(function () {
                // Cordova Local Notification plugin to put notifications into the device's notification bar
                $cordovaLocalNotification.schedule({
                    id: 1,
                    title: "Added Favorite",
                    text: $scope.dishes[index].name
                }).then(function () {
                    console.log('Added Favorite '+$scope.dishes[index].name);
                },
                function () {
                    console.log('Failed to add Notification ');
                });

                // Cordova Toast plugin to show a short message to the user on the device's screen
                $cordovaToast
                  .show('Added Favorite '+$scope.dishes[index].name, 'long', 'center')
                  .then(function (success) {
                      // success
                  }, function (error) {
                      // error
                  });
              });

            };
        }])

        // contactus.html
		.controller('ContactController', ['$scope', function($scope) {

            $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };

            var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];

            $scope.channels = channels;
            $scope.invalidChannelSelection = false;

        }])

        // contactus.html
		.controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope,feedbackFactory) {

            $scope.sendFeedback = function() {

                console.log($scope.feedback);

                if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
                    $scope.invalidChannelSelection = true;
                    console.log('incorrect');
                }
                else {
                    $scope.invalidChannelSelection = false;
                    feedbackFactory.save($scope.feedback);
                    $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
                    $scope.feedback.mychannel="";
                    $scope.feedbackForm.$setPristine();
                    console.log($scope.feedback);
                }
            };
        }])

        // dishdetail.html | dish-detail-popover.html | dish-comment.html
		.controller('DishDetailController', ['$scope', '$stateParams', 'dish', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicPopover', '$ionicModal', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', function($scope, $stateParams, dish, menuFactory, favoriteFactory, baseURL, $ionicPopover, $ionicModal, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {
            // Code for support the dish-detail popover
            $ionicPopover.fromTemplateUrl('templates/dish-detail-popover.html', {
                scope: $scope
                }).then(function(popover) {
                  $scope.popover = popover;
                });

            $scope.openPopover = function($event) {
                    $scope.popover.show($event);
                };
            $scope.closePopover = function() {
                    $scope.popover.hide();
                };

            //Cleanup the popover when we're done with it!
            $scope.$on('$destroy', function() {
                  $scope.popover.remove();
            });

            $scope.baseURL = baseURL;
			      $scope.dish = {};
            $scope.showDish = false;
            $scope.message ="Loading ...";

            $scope.dish = dish;

            // Add the dish to the list of my favorite dishes from the popover
            $scope.addFavorite = function () {
              console.log("index is " + $scope.dish.id);
              favoriteFactory.addToFavorites($scope.dish.id);
              $scope.closePopover();

              // Add Cordova plugin
              $ionicPlatform.ready(function () {
                // Cordova Local Notification plugin to put notifications into the device's notification bar
                $cordovaLocalNotification.schedule({
                    id: 1,
                    title: "Added Favorite",
                    text: $scope.dish.name
                }).then(function () {
                    console.log('Added Favorite '+$scope.dish.name);
                },
                function () {
                    console.log('Failed to add Notification ');
                });

                // Cordova Toast plugin to show a short message to the user on the device's screen
                $cordovaToast
                  .show('Added Favorite '+$scope.dish.name, 'long', 'bottom')
                  .then(function (success) {
                      // success
                  }, function (error) {
                      // error
                  });
              });

            };

           // dish-comment.html
          // Form data for the dish-comment modal
          $scope.comment = {};

          // Create the dish-comment modal that we will use later
          $ionicModal.fromTemplateUrl('templates/dish-comment.html', {
            scope: $scope
          }).then(function(modal) {
            $scope.commentform = modal;
          });

          // Triggered in the dish-comment modal to close it
          $scope.closeComment = function() {
            $scope.commentform.hide();
          };

          // Open the dish-comment modal
          $scope.openComment = function() {
            $scope.commentform.show();
          };

          // Perform the dish-comment action when the user submits the dish-comment form
          $scope.doComment = function() {
            $scope.comment.date = new Date().toISOString();
                console.log($scope.comment);

                $scope.dish.comments.push($scope.comment);
                menuFactory.update({id:$scope.dish.id},$scope.dish);
                $scope.closePopover();
                $scope.closeComment();
          };
        }])

		// dishdetail.html
        .controller('DishCommentController', ['$scope', 'menuFactory', function($scope,menuFactory) {

            $scope.mycomment = {rating:5, comment:"", author:"", date:""};

            $scope.submitComment = function () {

                $scope.mycomment.date = new Date().toISOString();
                console.log($scope.mycomment);

                $scope.dish.comments.push($scope.mycomment);
                menuFactory.update({id:$scope.dish.id},$scope.dish);

                $scope.commentForm.$setPristine();

                $scope.mycomment = {rating:5, comment:"", author:"", date:""};
            }
        }])

        // implement the IndexController and About Controller here
        // home.html
		.controller('IndexController', ['$scope', 'menuFactory', 'promotionFactory', 'corporateFactory', 'baseURL', 'dish', 'promotion', 'leader', function($scope, menuFactory, promotionFactory, corporateFactory, baseURL, dish, promotion, leader) {

                $scope.baseURL = baseURL;

                $scope.showDish = false;
                $scope.message = "Loading ...";

                $scope.dish = dish;
                $scope.promotion = promotion;
                $scope.leader = leader;
        }])

    // aboutus.html
		.controller('AboutController', ['$scope', 'corporateFactory', 'baseURL', 'leaders', function ($scope, corporateFactory, baseURL, leaders) {

                    $scope.baseURL = baseURL;
					          $scope.leaders = leaders;
                    console.log($scope.leaders);

		}])

        // favorites.html
        .controller('FavoritesController', ['$scope',  'dishes', 'favorites', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPopup', '$ionicLoading', '$timeout', '$localStorage', '$ionicPlatform', '$cordovaVibration', function ($scope, dishes, favorites, favoriteFactory, baseURL, $ionicListDelegate, $ionicPopup, $ionicLoading, $timeout, $localStorage, $ionicPlatform, $cordovaVibration) {

                    $scope.baseURL = baseURL;
                    // By default I'm not going to show the delete buttons
                    $scope.shouldShowDelete = false;

                    /* It will return to the JavaScript array of objects that contains the IDs
                    of all the favorite dishes I have selected*/
                    $scope.favorites = favorites;

                    // Getting the information about all the dishes
                    $scope.dishes = dishes;
                    console.log($scope.dishes, $scope.favorites);

                    // This function essentially toggles the value of shouldShowDelete
                    $scope.toggleDelete = function () {
                        $scope.shouldShowDelete = !$scope.shouldShowDelete;
                        console.log($scope.shouldShowDelete);
                    }

                    // index is a chosen dish, which I want to delete from my favorite list
                    $scope.deleteFavorite = function (index) {

                        var confirmPopup = $ionicPopup.confirm({
                            title: 'Confirm Delete',
                            template: 'Are you sure you want to delete this item?'
                        });

                        confirmPopup.then(function (res) {
							if (res) {
							 console.log('Ok to delete');
							 favoriteFactory.deleteFromFavorites(index);
							 // Cordova Plugin vibrate when the user confirms that the item should be deleted
							 $ionicPlatform.ready(function () {
							   $cordovaVibration.vibrate(1000);
							 });

							} else {
                             console.log('Canceled delete');
                            }
                        });
							/* When the dish element is deleted, I want to hide delete buttons from
							the list of my favorites */
							$scope.shouldShowDelete = false;
					}
        }])

.filter('favoriteFilter', function () {
    return function (dishes, favorites) {
        var out = [];
        for (var i = 0; i < favorites.length; i++) {
            for (var j = 0; j < dishes.length; j++) {
                if (dishes[j].id === favorites[i].id)
                    out.push(dishes[j]);
            }
        }

        return out;
      }
  });

;



