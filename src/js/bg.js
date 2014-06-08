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

			// handle new ones, notify user and send msg to popup for DOM updates
			for (var i = 0; i < streams.length; i++) {
				var id = streams[i].id,
					url = streams[i].userProfilePicUrl || 'http://www.placecage.com/200/200';

				if (!liveStreams[id]) {
					// add to current and new streams obj arrayz 
					newStreams[id] = liveStreams[id] = streams[i];

					// create new notification obj
					var notification = new Notify('New Stream!', {
						icon: url+'',
						body: streams[i].username + ' started streaming!',
						timeout: 10
					});

					// add to notifications property
					self._notifications.push(notification);
				}
			};

			while (self._notifications.length) {
				var n = self._notifications.shift();
				n.show();
			}

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

})();