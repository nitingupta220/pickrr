var app = angular.module("pickrrApp", ["ngMaterial", "ngMessages", "ngRoute"]);
app.config(function ($routeProvider, $locationProvider) {
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false,
    rewriteLinks: false,
  });
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
app.controller("loginController", function ($scope, $http, $location, $window) {
  $scope.email;
  $scope.password;
  var headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
  $scope.login = function () {
    console.log("creds", $scope.email, $scope.password);
    $http({
      method: "POST",
      url: "http://pickrrtesting.com/api/register-user-platform-plugin/",
      headers: headers,
      data: { shop_name: $scope.email, shop_token: $scope.password },
    }).then(function (response) {
      console.log("response==>", response.data);
      if (response.data.err === null) {
        $location.path("/orders");
      } else {
        alert("Wrong creds");
      }
    });
  };
});

app.controller("ordersController", function ($scope, $http) {
  $scope.email;
  $scope.password;
  var headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    "Access-Control-Allow-Origin": "*",
  };

  $http({
    method: "GET",
    url: "https://pickrr.herokuapp.com/fetch-shop-orders/harish-30/?days=2",
    headers: headers,
  }).then(function (response) {
    console.log("response==>", response.data);
  });
});
