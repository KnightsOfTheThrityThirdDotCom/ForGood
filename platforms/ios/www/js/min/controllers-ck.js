var serviceUrl="http://for-good.be/system/en/service/";angular.module("forgood.controllers",[]).controller("LoginCtrl",function(o,r,t){o.formData={},o.processForm=function(){console.log(o.formData),r({method:"POST",crossDomain:!0,data:o.formData,url:serviceUrl+"login"}).success(function(o){console.log(o),t.go("account-mobility")})}}).controller("MobilityCtrl",function(o,r,t){o.formData={},o.processForm=function(){console.log(o.formData),r({method:"POST",crossDomain:!0,data:o.formData,url:serviceUrl+"updateMobilityProfile"}).success(function(o){console.log(o),t.go("account-living")})}}).controller("LivingCtrl",function(o,r,t){o.formData={},o.processForm=function(){console.log(o.formData),r({method:"POST",crossDomain:!0,data:o.formData,url:serviceUrl+"updateEnergyProfile"}).success(function(o){console.log(o),t.go("account-monitor")})}}).controller("MonitorCtrl",function(o,r,t){o.formData={},o.processForm=function(){console.log(o.formData),r({method:"POST",crossDomain:!0,data:o.formData,url:serviceUrl+"updateService"}).success(function(o){console.log(o),t.go("progress-total")})}}).controller("ProgressCtrl",function(o,r){o.scan=function(){alert("test")}});