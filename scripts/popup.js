'use strict';

/**
 * [popupApp 插件开发事例，相应的github：git@github.com:angrytoro/redirect-resource.git]
 * @type {[type]}
 */
var popupApp = angular.module('popupApp', []);

popupApp.controller('popupCtrl', ['$scope',
	function($scope) {
		chrome.storage.sync.get(['redirections'], function(items) {
			$scope.redirections = items.redirections;
			$scope.$apply();
		});
	}
]);

$('.edit-btn').bind('click', function() {
	var fullUrl = chrome.extension.getURL('setting.html');
	chrome.tabs.query({}, function(tabs) {
		for (var i = 0, len = tabs.length; i < len; i++) {
			var tab = tabs[i];
			if (tab.url == fullUrl) {
				chrome.tabs.update(tab.id, {
					highlighted: true
				});
				return;
			}
		}
		chrome.tabs.getSelected(null, function(tab) {
			chrome.tabs.create({
				url: 'setting.html',
				index: tab.index + 1
			})
		});
	});
});