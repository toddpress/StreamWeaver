chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	var data = request.value;
	if (request.key == 'updated-streams') {
		if (data.added.length)
			generateThumbsMarkup(data.added);
		else if (data.removed.length)
			removeDeadStreams(data.removed);
	}
});

function removeDeadStreams(ids) {
	var sels = ids.map(function(id) {
		return '[data-stream-id='+id+']';
	});
	$('#streams').find(sels.join(',')).remove();
}

function generateThumbsMarkup(streams) {
	var baseURL = 'http://stre.am/';
	for (var i = 0; i < streams.length; i++) {

		var stream = streams[i],
			id = stream.id,
			pic = stream.userProfilePicUrl
					? stream.userProfilePicUrl
					: 'img/default-pic.png',
			username = stream.username,
			$container = $('<div/>', {
				'class':'stream-thumb-container',
				'data-stream-id': stream.id
			}),
			$thumbnail = $('<a/>', {
				'class':'stream-thumbnail',
				'href':baseURL+username+'/'+id,
				'style':'background-image: url('+stream.thumbUrl+');'
			}),
			$userPic = $('<a/>', {
				'class':'user-pic',
				'href':baseURL+username,
				'style': 'background-image: url('+pic+');'
			}),
			$channelLink = $('<a/>', {
				'class':'username',
				'href':baseURL+username,
				text: username
			}),
			$info = $userPic.add($channelLink),
			$userInfo = $('<div/>', {
				'class':'user-info clearfix',
				'html': $info
			}),
			$streamHtml = $container.append($thumbnail.add($userInfo));

		$streamHtml.prependTo('#streams');
	};
};

$(function() {
	chrome.runtime.sendMessage({ key: 'streams-requested'}, function(response) {
		var ids = Object.keys(response.streams);
		for (var i = 0, streams = []; i < ids.length; i++) {
			streams.push(response.streams[ids[i]]);
		};
		generateThumbsMarkup(streams);
	});
});
