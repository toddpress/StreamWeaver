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
			username = stream.username,
			url = baseURL + username,
			pic = stream.userProfilePicUrl
					? stream.userProfilePicUrl
					: 'img/default-pic.png',
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
	var	heartInterval;
	$('cite').on({
		'mouseenter': function() {
			if (heartInterval) clearInterval(heartInterval);
			var $this = $(this),
				$mom = $this.parent();

			heartInterval = setInterval(function() {
				var angle = ~~(Math.random()*360),
					t, l;

				t = $this[0].style.top + ~~(Math.cos(angle) * 100) *
						(Math.random() > 0.5 ? 1 : -1);

				l = $this[0].style.left + ~~(Math.sin(angle) * 100);

				var pos = 'top: '+ t +'px; '+'left:'+l+'px; opacity: 0; color: hsl('+ angle +', 100%, 50%);',
					$heart = $('<div/>', {
						'class': 'heart'
					});

				setTimeout(function() {
					$heart.attr('style', pos);
				});

				setTimeout(function() {
					$heart.remove();
				}, 1500);

				$heart.appendTo($mom);
			});
		},
		'mouseleave': function() {
			clearInterval(heartInterval);
		}
	});

	var noStreamMsgChars = $('#no-streams .unicorn').text().split(''),
		$noStreamsMsg = $('#no-streams .unicorn').empty(),
		stepSize = 360/20,
		animationTime = 1.5;

	for (var i = 0, len = noStreamMsgChars.length; i < len; i++) {
		var delay = (Math.abs((animationTime * ((i * stepSize) % 360) / 360) - animationTime)).toFixed(3);
		$('<span/>', {
			text: noStreamMsgChars[i],
			'style': '-webkit-animation-delay: ' + delay + 's; ' +
				'-webkit-animation-duration: ' + animationTime + 's;'
		}).appendTo($noStreamsMsg);
	};

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
