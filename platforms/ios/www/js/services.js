var serviceUrl = 'http://for-good.be/system/en/service/';

angular.module('forgood.services', [])

.factory('login', function() {

  return {
		submit: function($scope,$http) {
			//alert('test');
			$http({
				url: serviceUrl+'login',
				method: 'POST',
				data: {'foo':'bar'}
			}).success(function(data, status, headers, config) {
			    $scope.data = data;
			    alert($(scope.data));
			}).error(function(data, status, headers, config) {
			    $scope.status = status;
			});
		}
	}
});
