// @todo: more efficient dom creation
function makeThumb(stream) {
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

	return thumbHtml;
}
// @todo: i'm with stupid
function generateThumbsMarkup(streams) {
	var markup = '';
	for(var i = 0; i < streams.length; i++)	{
		var stream = streams[i];
		
		markup += makeThumb(stream);
	}
	return markup;
}
