app.controller("loginController", function (
  $scope,
  $http,
  $location,
  cfpLoadingBar,
  $window
) {
  $scope.shop_name;
  $scope.shop_token;
  var headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
  $scope.login = function () {
    cfpLoadingBar.start();
    $http({
      method: "POST",
      url: "http://pickrr.com/api/register-user-platform-plugin/",
      headers: headers,
      data: { shop_name: $scope.shop_name, shop_token: $scope.shop_token },
    }).then(function (response) {
      console.log("response==>", response.data.account_list);
      $window.sessionStorage.setItem(
        "account_list",
        angular.toJson(response.data.account_list)
      );
      if (response.data.err === null) {
        cfpLoadingBar.complete();
        $location.path("/orders");
      } else {
        alert("Wrong creds");
      }
    });
  };
});
