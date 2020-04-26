var app = angular.module("pickrrApp", [
  "ngMaterial",
  "ngMessages",
  "ngRoute",
  "angular-loading-bar",
  "ngAnimate",
  "infinite-scroll",
]);
app.config(function ($routeProvider, $locationProvider, $httpProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "public/login.html",
      controller: "loginController",
    })
    .when("/orders", {
      templateUrl: "public/orders.html",
      controller: "ordersController",
    })
    .otherwise({
      redirectTo: "/",
    });
});
