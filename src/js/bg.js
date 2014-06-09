(function() {

	var POLLING_INTERVAL = 5000,
		ENDPOINT = 'https://api.stre.am:9443/v1/stream',
		MOCK_ENDPOINT = 'src/js/mock-data/mock-streams.json';
		// @NOTE: ENDPOINT var not in use yet

	var StreamWeaverPoller = {
		_fails: 0,
		_interval: POLLING_INTERVAL,
		_endpoint: ENDPOINT,
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
				url: MOCK_ENDPOINT,
				context: self,
				dataType: 'json'
			})
			.done(function(data){
				streams = data;
				self._handleStreamSuccess(streams);
			})
			.fail(function(jqXHR, textStatus, error) {
				console.error('Shit! ', error);
				self._handleStreamFailure;
			});
		},

		_handleStreamSuccess: function(streams) {
			var self = this,
				liveStreams = self._streams,
				oldIds = removedIds = [],
				addedStreams = newStreams = {};

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
			for (var i = 0; i < streams.length; i++) {
				var id = streams[i].id,
					url = streams[i].userProfilePicUrl ||
						 'http://www.placecage.com/200/200';

				if (!liveStreams[id]) {
					// add to current and new streams obj arrayz
					addedStreams[id] = liveStreams[id] = streams[i];

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

			while (self._notifications.length) {
				var n = self._notifications.shift();
				n.show();
			}

			if (addedStreams.length || removedIds.length)
				chrome.runtime.sendMessage({
					key: 'updated-streams',
					value: {
						added: addedStreams,
						removed: removedIds
					}
				});

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
			// @TODO: only send response if StreamWeaverPoller is fully initialized,
			// and if any existing streams, make sure they've been plopped into
			// StreamWeaverPoller._streams
			StreamWeaverPoller._getStreams();
			sendResponse({ streams: StreamWeaverPoller._streams });
		}
	});

})();