function generateThumbsMarkup(streams) {
	var baseURL = 'http://stre.am/';
	for (var i = 0; i < streams.length; i++) {

		var stream = streams[i],
			id = stream.id, 
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
				'style': 'background-image: url('+stream.userProfilePicUrl+');'
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

		$streamHtml.appendTo('#streams');
	};
};

$(function() {
	// just testing shit atm
	var stream = [ 
		{
			"id": "63ed4e68e4b0a4dafedd1dd1",
			"created": 1390253268281,
			"updated": 1390253438593,
			"serverName": "live.infinitetakes.com:1935",
			"channelName": "d1c46322-5f62-44c2-bce3-c728e5d49875",
			"latitude": "32.900322",
			"longitude": "-79.916162",
			"categories": null,
			"viewerCount": "18532",
			"outputId": null,
			"status": null,
			"live": true,
			"thumbUrl": "img/mock-thumb.png",
			"userId": "52dd8eaee4b01f70ae3bdc93",
			"username": "testuserlottastreams",
			"polled": 1390253438593,
			"likes": 0,
			"dislikes": 0,
			"aspectRatio": "4:3",
			"userProfilePicUrl":"http://www.placecage.com/200/200"
		},
		{
			"id": "63ed4e68e4b0a4dafedd1dd1",
			"created": 1390253268281,
			"updated": 1390253438593,
			"serverName": "live.infinitetakes.com:1935",
			"channelName": "d1c46322-5f62-44c2-bce3-c728e5d49875",
			"latitude": "32.900322",
			"longitude": "-79.916162",
			"categories": null,
			"viewerCount": "18532",
			"outputId": null,
			"status": null,
			"live": true,
			"thumbUrl": "img/mock-thumb.png",
			"userId": "52dd8eaee4b01f70ae3bdc93",
			"username": "testuserlottastreams",
			"polled": 1390253438593,
			"likes": 0,
			"dislikes": 0,
			"aspectRatio": "4:3",
			"userProfilePicUrl":"http://www.placecage.com/200/200"
		},
		{
			"id": "63ed4e68e4b0a4dafedd1dd1",
			"created": 1390253268281,
			"updated": 1390253438593,
			"serverName": "live.infinitetakes.com:1935",
			"channelName": "d1c46322-5f62-44c2-bce3-c728e5d49875",
			"latitude": "32.900322",
			"longitude": "-79.916162",
			"categories": null,
			"viewerCount": "18532",
			"outputId": null,
			"status": null,
			"live": true,
			"thumbUrl": "img/mock-thumb.png",
			"userId": "52dd8eaee4b01f70ae3bdc93",
			"username": "testuserlottastreams",
			"polled": 1390253438593,
			"likes": 0,
			"dislikes": 0,
			"aspectRatio": "4:3",
			"userProfilePicUrl":"http://www.placecage.com/200/200"
		},
		{
			"id": "63ed4e68e4b0a4dafedd1dd1",
			"created": 1390253268281,
			"updated": 1390253438593,
			"serverName": "live.infinitetakes.com:1935",
			"channelName": "d1c46322-5f62-44c2-bce3-c728e5d49875",
			"latitude": "32.900322",
			"longitude": "-79.916162",
			"categories": null,
			"viewerCount": "18532",
			"outputId": null,
			"status": null,
			"live": true,
			"thumbUrl": "img/mock-thumb.png",
			"userId": "52dd8eaee4b01f70ae3bdc93",
			"username": "testuserlottastreams",
			"polled": 1390253438593,
			"likes": 0,
			"dislikes": 0,
			"aspectRatio": "4:3",
			"userProfilePicUrl":"http://www.placecage.com/200/200"
		}
	];
	generateThumbsMarkup(stream);
});
