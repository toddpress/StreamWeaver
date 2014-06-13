(function() {

	chrome.browserAction.getBadgeText({}, function(res) {
		if (!res){
			chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 0, 230] });
			chrome.browserAction.setBadgeText({ text: 0+'' })
		};
	});

	var POLLING_INTERVAL = 5000,
		ENDPOINT = 'https://api.stre.am:9443/v1/stream',
		MOCK_ENDPOINT = 'src/js/mock-data/mock-streams.json';

	var StreamWeaverPoller = {
		_fails: 0,
		_interval: POLLING_INTERVAL,
		_streams: {},
		_notifications: [],

		init: function() {
			var self = this;
			setTimeout(
				$.proxy(self._getStreams, self),
				self._interval
			);
		},

		_getStreams: function() {
			var self = this;
			$.ajax({
				url: ENDPOINT,
				context: self,
				dataType: 'json'
			})
			.done(function(data){
				streams = data.stream;
				self._handleStreamSuccess(streams);
			})
			.fail(function(jqXHR, textStatus, error) {
				console.error('Shit! ', error);
				self._handleStreamFailure;
			});
		},

		_handleStreamSuccess: function(streams) {
			var self = this,
				streamsLength = streams.length,
				liveStreams = self._streams,
				oldIds = removedIds = [],
				addedStreams = [],
				newStreams = {};

			// create streams obj, keyed to ids, for tracking dead
			streams.forEach(function(stream) {
				newStreams[stream.id] = stream;
			});

			// remove dead streams & store ids to be sent w/ updated-streams message
			// will use store all ids in data-attributes, so when update happens w/ remove,
			// can target by data-attr to easily remove
			oldIds = Object.keys(liveStreams);
			for (var i = 0; i < oldIds.length; i++) {
				if (!newStreams.hasOwnProperty(oldIds[i])) {
					var oldId = oldIds[i];

					removedIds.push(oldIds[i]);

					delete liveStreams[oldId];
				}
			};

			// handle new ones, notify user and send msg to popup for DOM updates
			for (var i = 0; i < streamsLength; i++) {
				var id = streams[i].id,
					url = streams[i].userProfilePicUrl ||
						 'src/img/default-pic.png';

				if (!liveStreams[id]) {
					// add to current streams object and new streams array
					liveStreams[id] = streams[i];
					addedStreams.push(streams[i]);

					// create new notification obj
					var notification = new Notify('New Stream!', {
						icon: url,
						body: streams[i].username + ' started streaming!',
						timeout: 60
					});

					// add to notifications property
					self._notifications.push(notification);
				}
			};

			// fire off notifications
			while (self._notifications.length) {
				var n = self._notifications.shift();
				n.show();
			}

			if (addedStreams.length || removedIds.length) {
				chrome.runtime.sendMessage({
					key: 'streams-updated',
					value: {
						added: addedStreams,
						removed: removedIds
					}
				});
				// update badge stream count
				chrome.browserAction.setBadgeText({ text: streamsLength+'' });
			}

			// update current streams and recurse
			self._streams = liveStreams;
			self.init();
		},

		_handleStreamFailure: function() {
			if (++this._fails < 10) {
				this._interval += 1000;

				this.init();
			}
		}
	}

	StreamWeaverPoller.init();

	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		if (request.key == 'streams-requested') {
			// sends current streams when popup opened
			sendResponse({ streams: StreamWeaverPoller._streams });
		}
	});

})();