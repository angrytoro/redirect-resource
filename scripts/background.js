/**
 * [数据结构]
 * {
		"name": "xxx",
		"src": '资源链接',
		"localSrc": '本地资源链接',
		"redirect": [true|false] //是否重定向
	}
 */
var typeMap = {
    "txt"   : "text/plain",
    "html"  : "text/html",
    "css"   : "text/css",
    "js"    : "text/javascript",
    "json"  : "text/json",
    "xml"   : "text/xml",
    "jpg"   : "image/jpeg",
    "gif"   : "image/gif",
    "png"   : "image/png"
};

function getLocalFile(url) {
	var xhr = new XMLHttpRequest();
	xhr.open('get', url, false); //同步获取数据
	xhr.send(null);
	var content = xhr.responseText || xhr.responseXML;
	if (!content) {
		return false;
	}
	var type = url.split('.').pop();
	// content = encodeURIComponent(
 //        type === 'js' ?
 //        content.replace(/[\u0080-\uffff]/g, function($0) {
 //            var str = $0.charCodeAt(0).toString(16);
 //            return "\\u" + '00000'.substr(0, 4 - str.length) + str;
 //        }) : content
 //    );
 //    console.log(content);
	return 'data:' + (typeMap[type] || typeMap.txt) + ';charset=utf-8,' + content;
};
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
	for(var i = 0, len = redirections.length; i < len; i++) {
		var redirection = redirections[i];
		if (details.url == redirection.src && redirection.redirect) {
			return {
				redirectUrl: getLocalFile('file:///' + redirection.localSrc)
			};
		}
	}
	return true;
}, {
	urls: ["<all_urls>"]
}, ["blocking"]);