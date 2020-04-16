var app = angular.module("pickrrApp", [
  "ngMaterial",
  "ngMessages",
  "ngRoute",
  "angular-loading-bar",
  "ngAnimate",
]);
app.config(function ($routeProvider, $locationProvider, $httpProvider) {
  $httpProvider.defaults.useXDomain = true;

  delete $httpProvider.defaults.headers.common["X-Requested-With"];

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
app.controller("loginController", function (
  $scope,
  $http,
  $location,
  cfpLoadingBar
) {
  $scope.email;
  $scope.password;
  var headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
  $scope.login = function () {
    cfpLoadingBar.start();
    $http({
      method: "POST",
      url: "http://pickrrtesting.com/api/register-user-platform-plugin/",
      headers: headers,
      data: { shop_name: $scope.email, shop_token: $scope.password },
    }).then(function (response) {
      if (response.data.err === null) {
        cfpLoadingBar.complete();
        $location.path("/orders");
      } else {
        alert("Wrong creds");
      }
    });
  };
});

app.controller("ordersController", function ($scope, $http, $sce) {
  $scope.email;
  $scope.password;
  $scope.account = {};
  // var headers = {
  //   "Content-Type": "application/x-www-form-urlencoded",
  // };
  var headers = {
    "Access-Control-Allow-Origin": true,
    "Content-Type": "application/json; charset=utf-8",
    "X-Requested-With": "XMLHttpRequest",
  };

  $http({
    method: "GET",
    url: "http://pickrr.herokuapp.com/fetch-shop-orders/harish-30/?days=10",
    headers: headers,
  })
    .then(function (response) {
      console.log("response==>", response);
      $scope.data = response.data.orders;
    })
    .catch(function (response) {
      console.log(response);
      $scope.response = "ERROR: " + response.status;
    });

  $scope.orderList = [];
  $scope.pushToArray = function (data, value) {
    if (value) {
      $scope.orderList.push(data);
    } else {
      $scope.orderList.splice($scope.orderList.indexOf(data), 1);
    }
  };

  $scope.addToOrder = function (key, value) {
    for (var i = 0; i < $scope.orderList.length; i++) {
      $scope.orderList[i][key] = value;
      console.log("list==>", $scope.orderList);
    }
  };

  $scope.emailList = {};

  $scope.convertStringToArray = function () {
    $scope.array = $scope.emailList.value.split(",");
    console.log("email list==>", typeof $scope.array);
  };

  $scope.placeOrder = function () {
    var order_list = $scope.orderList;

    var jsonData = { order_list };

    var objectToSerialize = {
      order_data: jsonData,
      email_list: $scope.array,
      auth_token: $scope.account.value,
      shop_platform: { name: "shopify", store_name: $scope.data.store },
    };
    console.log("array value==>", $scope.array);
    console.log("postdata==>", objectToSerialize);
    $http({
      method: "POST",
      url: "http://pickrrtesting.com/api/bulk-place-order/",
      headers: headers,
      data: angular.toJson(objectToSerialize),
    }).then(function (response) {
      console.log("response after placing order==>", response.data.err);
      if (response.data.err === null) {
        alert("Order placed successfully");
      } else {
        alert("Error, in placing order");
      }
    });
  };
});
