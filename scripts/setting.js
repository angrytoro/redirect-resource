'use strict';

var dialog = $('.dialog');
$('#list-container').on('click', '.btn-success', function(e) {
	var el = $(e.currentTarget);
	var parent = el.parents('tr');
	if (parent.hasClass('edit')) {
		el.html('Edit');
		parent.removeClass('edit');
	} else {
		el.html('Save');
		parent.addClass('edit');
	}
});

var settingApp = angular.module('settingApp', []);

var settingCtrl = settingApp.controller('settingCtrl', function($scope) {
	chrome.storage.sync.get(['redirections'], function(items) {
		$scope.redirections = items.redirections;
		$scope.$apply();
	});
	$scope.changeStatus = function(index, e) {
		$scope.redirections[index].redirect = !$scope.redirections[index].redirect;
		chrome.storage.sync.set({
			redirections: $scope.redirections
		}, function() {
			console.log(arguments);
		});
	};
	// $scope.$watch('redirections', function(redirections) { //如果设置深度监视deepWatch的话，那么就会产生性能问题
	// 	chrome.storage.sync.set({
	// 		redirections: $scope.redirections
	// 	}, function() {
	// 		console.log(arguments);
	// 	});
	// }, true);
	$scope.delete = function(index, e) {
		$scope.redirections.splice(index, 1);
		chrome.storage.sync.set({
			redirections: $scope.redirections
		}, function() {
			console.log(arguments);
		});
	};
	$scope.save = function(index, e) {
		if (e.target.innerHTML.trim() == 'Save') {
			chrome.storage.sync.set({
				redirections: $scope.redirections
			}, function() {
				console.log(arguments);
			});
		}
	};
	$scope.open = function() {
		dialog.toggleClass('hide');
	};
	$scope.close = function() {
		dialog.toggleClass('hide');
	};
	$scope.add = function() {
		var redirection = {
			redirect: true
		};
		var inputs = dialog.find('input');
		var src = inputs.filter('[name="src"]').val();
		var name = src.split('/').pop();
		redirection.name = name;
		redirection.src = src;
		redirection.localSrc = inputs.filter('[name="localSrc"]').val();
		$scope.redirections.push(redirection);
		chrome.storage.sync.set({
			redirections: $scope.redirections
		}, function() {
			console.log(arguments);
		});
	};
});
settingCtrl.$inject = ['$scope']; //第二种依赖注入方式