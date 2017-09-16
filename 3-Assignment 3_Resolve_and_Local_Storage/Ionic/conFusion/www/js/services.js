'use strict';

angular.module('conFusion.services', ['ngResource'])
        .constant('baseURL', 'http://localhost:3000/')
        //.constant("baseURL","http://192.168.1.104:3000/")
        // MenuController (menu.html)

        .factory('menuFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

            return $resource(baseURL + "dishes/:id", null, {
                'update': {
                    method: 'PUT'
                }
            });

        }])

        // Implement a function that returns a selected promotion.
        .factory('promotionFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

            return $resource(baseURL + "promotions/:id");

        }])

        // AboutController (aboutus.html)
        .factory('corporateFactory', ['$resource', 'baseURL', function($resource,baseURL) {


            return $resource(baseURL+"leadership/:id");

        }])

        // FeedbackController (contactus.html)
        .factory('feedbackFactory', ['$resource', 'baseURL', function($resource,baseURL) {


            return $resource(baseURL+"feedback/:id");

        }])

        // MenuController (menu.html) | FavoritesController (favorites.html)
        .factory('favoriteFactory', ['$resource', '$localStorage','baseURL', function ($resource, $localStorage, baseURL) {
            var favFac = {};
            var favorites = $localStorage.getObject('favorites','[]');

            favFac.addToFavorites = function (index) {
                for (var i = 0; i < favorites.length; i++) {
                    if (favorites[i].id == index)
                        return;
                }
                favorites.push({id: index})
                $localStorage.storeObject('favorites', favorites);

            };

        //  Will add in the ability to delete an item from My Favorites
        favFac.deleteFromFavorites = function (index) {
                for (var i = 0; i < favorites.length; i++) {
                    if (favorites[i].id == index) {
                        favorites.splice(i, 1);
                    }
                }
                $localStorage.storeObject('favorites', favorites);
         };

        // Returns all the favorites from the list of favorites that I have
        favFac.getFavorites = function () {
                 return favorites;
            };

                return favFac;

        }])

    // Adding $localStorage Service
    .factory('$localStorage', ['$window', function($window) {
     return {
      store: function(key, value) {
          $window.localStorage[key] = value;
      },
      get: function(key, defaultValue) {
        return $window.localStorage[key] || defaultValue;
      },
      storeObject: function(key, value) {
        $window.localStorage[key] = JSON.stringify(value);
      },
      getObject: function(key,defaultValue) {
       return JSON.parse($window.localStorage[key] || defaultValue);
     }
  }
}])
;
