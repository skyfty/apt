angular.module('app', []).controller('chat', function($scope, $http, $timeout) {

    function hideLoader() {
        $('.preloader').hide();
    }
    $(window).ready(hideLoader);
    setTimeout(hideLoader, 20 * 1000);

    const custom_scrollbar = document.querySelector('.custom-scrollbar2');

    const ps = new PerfectScrollbar(custom_scrollbar,{
        suppressScrollX: true,
        wheelPropagation :false,
        wheelSpeed: 2,
        minScrollbarLength: 20
    });
    ps.isRtl = false;
    ps.update();
    $scope.updateScrollbar = function() {
        $timeout(function(){
            ps.update();
            custom_scrollbar.scrollTop = custom_scrollbar.scrollHeight;
        });
    }

    $scope.messages = [
    ];
    $scope.content= "";
    $scope.postting= false;

    $scope.sendMessage = function() {
        $scope.messages.push({
            "role":"user",
            "content":$scope.content
        });
        $scope.updateScrollbar();

        $scope.content = "";
        $scope.postting = true;

        $http.post("http://18.119.97.59:8180/message", {"messages":$scope.messages}).then(response=> {
            $scope.messages.push(response.data);
            $scope.postting = false;
            $scope.updateScrollbar();
        });
    }
});


