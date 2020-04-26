var app = angular.module("pickrrApp", [
  "ngMaterial",
  "ngMessages",
  "ngRoute",
  "angular-loading-bar",
  "ngAnimate",
  "infinite-scroll",
]);
app.config(function ($routeProvider, $locationProvider, $httpProvider) {
  // $httpProvider.defaults.useXDomain = true;

  // delete $httpProvider.defaults.headers.common["X-Requested-With"];

  // $locationProvider.html5Mode({
  //   enabled: true,
  //   requireBase: false,
  //   rewriteLinks: false,
  // });
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
  $rootScope,
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
      url: "http://pickrr.com/api/register-user-platform-plugin/",
      headers: headers,
      data: { shop_name: $scope.email, shop_token: $scope.password },
    }).then(function (response) {
      console.log("response==>", response);
      if (response.data.err === null) {
        cfpLoadingBar.complete();
        $location.path("/orders");
      } else {
        alert("Wrong creds");
      }
    });
  };
});

app.controller("ordersController", function ($scope, $http, $rootScope, $sce) {
  $scope.email;
  $scope.password;
  $scope.account = {};
  $scope.extraFeature = {};
  $scope.date;
  $scope.search;
  $scope.orderList = [];
  $scope.emailList = {};

  var headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
  };

  // <-----GETTING INTIAL ORDERS----->
  // fetch("http://pickrr.com/plugins/fetch-shop-orders/harish-30/?days=9", {
  //   method: "GET",
  //   mode: "cors",
  //   cache: "no-cache",
  //   headers: {
  //     "Content-Type": "application/json",
  //     // 'Content-Type': 'application/x-www-form-urlencoded',
  //   },
  // }).then(function (response) {
  //   console.log(
  //     response.json().then(function (response) {
  //       console.log("get", response);
  //     })
  //   );
  // });

  $http({
    cache: true,
    method: "GET",
    // url: "https://nitingupta220-proxy-server.herokuapp.com/orders",
    url: "http://pickrr.com/plugins/fetch-shop-orders/harish-30/?days=9",
    // url: url,
    // headers: headers,
  })
    .then(function (response) {
      console.log("response==>", response);
      $scope.data = response.data.orders;
    })
    .catch(function (response) {
      console.log(response);
      $scope.response = "ERROR: " + response.status;
    });

  // <----PUSHING TO ARRAY WHEN SELECTING CHECKBOX------>
  $scope.pushToArray = function (data, value) {
    if (value) {
      $scope.orderList.push(data);
    } else {
      $scope.orderList.splice($scope.orderList.indexOf(data), 1);
    }
  };

  // <----CONVERTING STRING TO EMAIL LIST----->
  $scope.convertStringToArray = function () {
    $scope.array = $scope.emailList.value.split(",");
  };

  // <----POSTING DATA---->
  $scope.placeOrder = function () {
    for (var i = 0; i < $scope.orderList.length; i++) {
      $scope.orderList[i][$scope.extraFeature.value] = true;
      console.log("list==>", $scope.orderList);
    }

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
      cache: true,
      method: "POST",
      url: "http://pickrr.com/api/bulk-place-order/",
      headers: headers,
      data: angular.toJson(objectToSerialize),
    }).then(function (response) {
      if (response.data.err === null) {
        alert("Order placed successfully");
      } else {
        alert("Error, in placing order");
      }
    });
  };

  // <------MODAL OPEN------>
  $scope.showPrompt = function (order) {
    console.log("order detaisl==>", order);
    $scope.modalData = order;
  };

  // <-----GETTING ORDER WHEN DATE CHANEGS----->
  $scope.changeDate = function (date) {
    var date = new Date(date).getDate();
    $http({
      cache: true,
      method: "GET",
      // url: "https://nitingupta220-proxy-server.herokuapp.com/orders",
      url:
        "https://pickrr.herokuapp.com/fetch-shop-orders/harish-30/?days=" +
        date,
      headers: headers,
    })
      .then(function (response) {
        console.log("after changing date==>", response);
        $scope.data = response.data.orders;
      })
      .catch(function (response) {
        console.log(response);
        $scope.response = "ERROR: in changing date " + response.status;
      });
  };
});
