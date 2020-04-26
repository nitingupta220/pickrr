app.controller("ordersController", function ($scope, $http, cfpLoadingBar) {
  cfpLoadingBar.start();

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
  fetch("http://pickrr.com/plugins/fetch-shop-orders/harish-30/?days=9", {
    method: "GET",
    mode: "cors",
    cache: "force-cache",
  }).then(function (response) {
    response.json().then(function (response) {
      console.log("response==>", response);
      $scope.store_name = response.orders.store;
      cfpLoadingBar.complete();
      $scope.data = response.orders.uorders;
    });
  });

  //   $http({
  //     cache: true,
  //     method: "GET",
  //     // url: "https://nitingupta220-proxy-server.herokuapp.com/orders",
  //     url: "http://pickrr.com/plugins/fetch-shop-orders/harish-30/?days=9",
  //     // url: url,
  //     // headers: headers,
  //   })
  //     .then(function (response) {
  //       console.log("response==>", response);
  //       $scope.data = response.data.orders;
  //     })
  //     .catch(function (response) {
  //       console.log(response);
  //       $scope.response = "ERROR: " + response.status;
  //     });

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
    cfpLoadingBar.start();
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
      shop_platform: { name: "shopify", store_name: $scope.store_name },
    };
    console.log("array value==>", $scope.array);
    console.log("postdata==>", objectToSerialize);
    fetch("http://pickrr.com/api/bulk-place-order/", {
      mode: "cors",
      method: "POST",
      // headers: headers,
      body: JSON.stringify(objectToSerialize),
    }).then(function (response) {
      response.json().then(function (response) {
        if (response.err === null) {
          cfpLoadingBar.complete();
          alert("Order placed successfully");
        } else {
          alert("Error, in placing order");
        }
      });
    });
    // $http({
    //   cache: true,
    //   method: "POST",
    //   url: "c",
    //   headers: headers,
    //   data: angular.toJson(objectToSerialize),
    // }).then(function (response) {
    //   if (response.data.err === null) {
    //     alert("Order placed successfully");
    //   } else {
    //     alert("Error, in placing order");
    //   }
    // });
  };

  // <------MODAL OPEN------>
  $scope.showPrompt = function (order) {
    console.log("order detaisl==>", order);
    $scope.modalData = order;
  };

  // <-----GETTING ORDER WHEN DATE CHANEGS----->
  $scope.changeDate = function (date) {
    cfpLoadingBar.start();
    var date = new Date(date).getDate();
    var currentDate = new Date().getDate() - date;
    fetch(
      "http://pickrr.com/plugins/fetch-shop-orders/harish-30/?days=" +
        currentDate,
      {
        method: "GET",
        mode: "cors",
        cache: "force-cache",
      }
    ).then(function (response) {
      response.json().then(function (response) {
        cfpLoadingBar.complete();
        $scope.data = response.orders.uorders;
      });
    });
    // $http({
    //   cache: true,
    //   method: "GET",
    //   // url: "https://nitingupta220-proxy-server.herokuapp.com/orders",
    //   url:
    //     "https://pickrr.herokuapp.com/fetch-shop-orders/harish-30/?days=" +
    //     currentDate,
    //   headers: headers,
    // })
    //   .then(function (response) {
    //     console.log("after changing date==>", response);
    //     $scope.data = response.data.orders;
    //   })
    //   .catch(function (response) {
    //     console.log(response);
    //     $scope.response = "ERROR: in changing date " + response.status;
    //   });
  };
});
