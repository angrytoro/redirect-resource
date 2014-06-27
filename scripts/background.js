/**
 * [数据结构]
 * {
		"name": "xxx",
		"src": '资源链接',
		"localSrc": '本地资源链接',
		"redirect": [true|false] //是否重定向
	}
 */
var redirections = null;
chrome.runtime.onInstalled.addListener(function(details) {
	chrome.storage.sync.get(['redirections'], function(items) {
		redirections = items.redirections;
	});
	// chrome.storage.sync.set({
	// 	redirections: [{
	// 		name: 'bootstrap-theme.css',
	// 		src: 'http://cdn.bootcss.com/bootstrap/3.1.1/css/bootstrap-theme.css',
	// 		localSrc: 'E:\\svn\\yihuawx\\src\\styles\\popup.css',
	// 		redirect: true
	// 	}]
	// }, function() {
	// 	console.log(arguments);
	// });
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
	for (key in changes) {
		if (key == 'redirections') {
			redirections = changes[key].newValue;
		}
	}
});

chrome.webRequest.onBeforeRequest.addListener(function(details) {
	redirections.forEach(function(redirection, index) {
		
		if (details.url == redirection.src && redirection.redirect) {
			return {
				redirectUrl: 'file:///' + redirection.localSrc
			};
		}
	});
}, {
	urls: ["<all_urls>"]
}, ["blocking"]);