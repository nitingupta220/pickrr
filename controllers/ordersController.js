app.controller("ordersController", function (
  $scope,
  $location,
  cfpLoadingBar,
  $timeout,
  $window
) {
  cfpLoadingBar.start();

  $scope.email;
  $scope.password;
  $scope.account = {};
  $scope.extraFeature = { value: "air" };
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
    // mode: "cors",
    cache: "force-cache",
  }).then(function (response) {
    response.json().then(function (response) {
      $scope.account_list = $window.sessionStorage.getItem("account_list");
      $scope.account = JSON.parse($scope.account_list)
      console.log("response==>", response, JSON.parse($scope.account_list));
      $scope.store_name = response.orders.store;
      cfpLoadingBar.complete();
      $scope.data = response.orders.uorders;
      $scope.porders = response.orders.porders;
      $scope.data.forEach(function (obj) {
        obj.original = true;
      });
    });
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
  // $scope.convertStringToArray = function () {
  //   $scope.array = $scope.emailList.value.split(",");
  // };

  // <----POSTING DATA---->
  $scope.placeOrder = function () {
    cfpLoadingBar.start();

    $scope.array = $scope.emailList.value.split(",");

    for (var i = 0; i < $scope.orderList.length; i++) {
      if ($scope.extraFeature.value !== "air") {
        $scope.orderList[i][$scope.extraFeature.value] = true;
        console.log("list==>", $scope.orderList);
      }
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
          alert(
            "Your order placed successfully!!!  You'll receive an email regarding the order details."
          );
        } else {
          alert("Error, in placing order");
        }
      });
    });
  };

  // <------MODAL OPEN------>
  $scope.openModal = function (order, recipient) {
    console.log("order details==>", order, recipient);
    $scope.send = recipient;
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
        // mode: "cors",
        cache: "force-cache",
      }
    ).then(function (response) {
      response.json().then(function (response) {
        cfpLoadingBar.complete();
        $scope.data = response.orders.uorders;
        $scope.data.forEach(function (obj) {
          obj.original = true;
        });
      });
    });
  };

  // <-----Logout------>
  $scope.logout = function () {
    cfpLoadingBar.start();
    $timeout(function () {
      $location.path("/");
      cfpLoadingBar.complete();
    }, 2000);
  };

  // <------Clone Order------->
  $scope.cloneOrder = function (order) {
    cfpLoadingBar.start();
    const newOrder = angular.copy(order);
    newOrder.original = false;
    $scope.data.unshift(newOrder);
    cfpLoadingBar.complete();
  };
});
