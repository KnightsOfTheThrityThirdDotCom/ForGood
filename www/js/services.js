angular.module('forgood.services', [])

.factory('Product', function() {

	var product;

	return {
		submit: function(prod) {
			product = prod;
		},
		get: function() {
			//console.log(typeof localStorage.product);
			//console.log(product);
			return product;
		}
	}

});
