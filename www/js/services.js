var serviceUrl = 'http://for-good.be/system/nl/service/';

angular.module('forgood.services', [])

.factory('UserData', function($http){
	
	var userData;
	
	return {
		get: function(sha){
			return $http({
				method  : 'GET',
				crossDomain: true,
				url     : serviceUrl+'stats'+sha
			}).success(function(data){
				return userData = data;
			});
		}
	}
})

.factory('Product', function(ColorClass) {

	var product;

	return {
		submit: function(prod) {
			product = prod;
			product.colorClass = ColorClass.get(prod);
		},
		get: function() {
			return product;
			console.log(product);
		}
	}

})

.factory('ColorClass', function() {

	var color;

	return {
		get: function(prod) {
			var fp = prod.product.voetafdruk;
			var avgFp = prod.product.avg_voetafdruk;
			var diff = ((fp-avgFp)/((fp+avgFp)/2))*100;
			if(fp < avgFp){
				if(diff <= -20){
					return 'bgGreen';
				}
				else if(diff > -20){
					return 'bgYellow';
				}
			} 
			else if(fp === avgFp){
				return 'bgYellow';
			}
			else if(fp > avgFp) {
				if(diff <= 20){
					return 'bgYellow';
				}
				else if(diff > 20){
					return 'bgRed';
				}
			}
		}
	}

})

.factory('tips', function() {
	return {
		remove: function(array,id,newObject){
			var evalObjectContent = function(object, data, callback) {
				if(object === null || object === undefined) {
					return;
				}
				if(object instanceof String || typeof (object) === "string") {
					return;
				}
				if(object instanceof Number || typeof(object) ==="number") {
					return;
				}
				if(object instanceof Array) {
					for(var i = object.length-1;i>=0;--i) {
						var item = object[i];
						var res = callback(object, i, item, true, data);
						if(res !== false) {
							evalObjectContent(item, data, callback);
						}
					}
					return;
				}
				for(var v in object) {
					var item = object[v];
					var res = callback(object, v, item, false, data);
					if(res !== false) {
						evalObjectContent(item, data, callback);
					}
				}
			};
				
			var itemHasId = function(item, id) {
				if(item === null || item === undefined) {
					return false;
				}
				if(typeof (item) === "string" || item instanceof String) {
					return false;
				}
				if(typeof (item) === "number" || item instanceof Number) {
					return false;
				}
				var itemid = item.id;
				if(itemid === null || itemid === undefined) {
					return false;
				}
				if(itemid === id) {
					return true;
				}
				if(typeof (itemid) !== typeof(id)) {
					itemid = parseInt(itemid);
					id = parseInt(id);
					return itemid === id;
				}
					return false;
			};
				
			//
				
			evalObjectContent(array, {id:id, action:"replace",replacement:newObject}, function(object, index, value, isarray, data) {
				//console.log(data.counter)
				
				/*if(data.counter>0){
					return;
				}*/
				
				if (itemHasId(value, data.id)) {
					console.log("found: "+object, index, value, isarray)
					//++data.counter;
					if(isarray) {
						if(data.action==="delete") {
							object.splice(index, 1);
						} else if(data.action==="replace") {
							object[index] = data.replacement;
						}
					} else {
						if(data.action === "delete") {
							delete object[index];
						} else if(data.action === "replace") {
							object[index] = data.replacement;
						}
					}
				}
			});	
		}
	}
});
