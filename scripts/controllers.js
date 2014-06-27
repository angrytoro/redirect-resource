'use strict';

var redirectControllers = angular.module('redirectControllers', []);

redirectControllers.controller('popupCtrl', ['$scope',
	function($scope) {
		chrome.storage.sync.get(['redirections'], function(items) {
			$scope.redirections = items;
		});
	}
]);

redirectControllers.controller('settingCtrl', ['$scope',
	function($scope) {
		chrome.storage.sync.get(['redirections'], function(items) {
			$scope.redirections = items;
		});
	}
]);