function generateThumbMarkup(streams) {
	var output = '';
	for(var i = 0; i < streams.length; i++)	{
		var stream = streams[i],
			id = stream.id,
			username = stream.username,
			thumbUrl = stream.thumbUrl,
			userThumb = stream.userProfilePicUrl || 'img/default-profile.png',
			likes = stream.likes,
			viewers = stream.viewerCount || 0,
			thumbHtml = "<div class='stream-thumb-container' data-stream-id='" + id + "'>" +
							"<a href='http://stre.am/" + username + "/" + id + 
								"' class='stream-thumbnail' style='background-image: url(" + thumbUrl + ");'>" +
							"</a>" +
							"<div class='stream-info'>" +
								"<span class='userpic' style='background-image: url(" + userThumb + ");'></span>" +
								"<div class='user-info'>" +
									"<span class='user'>" +
										"<a target='_blank' href='http://stre.am/" + username + "'>" + username + "</a>" +
									"</span>" +
									"<span class='likes'><strong>Likes</strong>: " + likes + "</span>" +
									"<span class='viewers'><strong>Viewers</strong>: " + viewers + "</span>" +
								"</div>" +
							"</div>" +
						"</div>";
			output += thumbHtml;
	}
	return output;
}

function getStreams() {
	var streams = [];
	$.getJSON('https://api.stre.am:9443/v1/stream')
		.done(function(data, s, jqXHR) {
			streams = data.stream;
			var markup = generateThumbMarkup(streams);
			$('#streams').empty().append(markup);
		});
}

$(function() {
	getStreams();

	var pollInterval = setInterval(function() {
		getStreams();
	}, 30000);

});