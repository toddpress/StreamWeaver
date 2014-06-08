(function() {

	var POLLING_INTERVAL = 5000,
		ENDPOINT = 'https://api.stre.am:9443/v1/stream',
		DEVT_ENDPOINT = 'src/js/mock-data/mock-streams.json';

	var StreamWeaverPoller = {
		_fails: 0,
		_interval: POLLING_INTERVAL,
		_endpoint: DEVT_ENDPOINT,
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
				url: 'src/js/mock-data/mock-streams.json',
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
				newStreams = {},
				oldIds = [];

			// remove dead streams
			oldIds = Object.keys(liveStreams);

			for (var i = 0; i < oldIds.length; i++) {
				if (!liveStreams.hasOwnProperty(oldIds[i])) {
					delete liveStreams[oldIds[i]];
				}
			};

			// queue push notifications for truly new streams
			for (var i = 0; i < streams.length; i++) {
				var id = streams[i].id,
					url = streams[i].userProfilePicUrl || 'http://www.placecage.com/200/200';

				if (!liveStreams[id]) {
					liveStreams[id] = streams[i];
					newStreams[id] = streams[i];

					var notification = new Notify('New Stream!', {
						icon: url+'',
						body: streams[i].username + ' started streaming!',
						timeout: 10
					});

					self._notifications.push(notification);
				}
			};

			while (self._notifications.length) {
				var n = self._notifications.shift();
				n.show();
			}

			self._streams = liveStreams;
			self.init();

			if (newStreams.length)
				chrome.runtime.sendMessage({key: 'new-streams', data: newStreams});		
		},

		_handleStreamFailure: function() {
			if (++this._fails < 10) {
				this._interval += 1000;

				this.init();
			}	
		}		
	}

	console.clear();
	StreamWeaverPoller.init();
		// StreamWeaverPoller.prototype.on = function(evt, handler) {
		// 	(this._handlers[evt] || (this.handlers[evt] = [])).push(handler);
		// 	return this;
		// };

		// StreamWeaverPoller.prototype.emit = function(evt, value) {
		// 	var handlers = this.handlers[evt];
		// 	if (!handlers) return this;

		// 	for (var i = 0, len = handlers.length; i < len; i++) {
		// 		handlers[i].call(this, value);
		// 	}
		// 	return this;
		// };
})();