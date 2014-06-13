chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	var data = request.value;
	if (request.key == 'streams-updated') {
		if (data.added.length)
			generateThumbsMarkup(data.added);
		else if (data.removed.length)
			removeDeadStreams(data.removed);
	}
});

function removeDeadStreams(ids) {
	var $streams = $('#streams'),
		sels = ids.map(function(id) {
			return '[data-stream-id='+id+']';
		});

	$streams.find(sels.join(',')).remove();

	if (!$streams.children().length)
		$('body').addClass('no-streams');
}

function generateThumbsMarkup(streams) {
	var baseURL = 'http://stre.am/';
	$('body').removeClass('no-streams');

	for (var i = 0; i < streams.length; i++) {

		var stream = streams[i],
			id = stream.id,
			pic = stream.userProfilePicUrl
					? stream.userProfilePicUrl
					: 'img/default-pic.png',
			username = stream.username,
			url = baseURL + username,
			$container = $('<div/>', {
				'class':'stream-thumb-container',
				'data-stream-id': stream.id
			}),
			$thumbnail = $('<a/>', {
				'class':'stream-thumbnail',
				'href': url,
				'style':'background-image: url('+stream.thumbUrl+');',
				'target': '_blank'
			}),
			$userPic = $('<a/>', {
				'class':'user-pic',
				'href': url,
				'style': 'background-image: url('+pic+');',
				'target': '_blank'
			}),
			$channelLink = $('<a/>', {
				'class':'username',
				'href': url,
				'target': '_blank',
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
		if (!ids.length) {
			$('body').addClass('no-streams');
			return;
		}
		for (var i = 0, streams = []; i < ids.length; i++) {
			streams.push(response.streams[ids[i]]);
		};
		generateThumbsMarkup(streams);
	});
});
