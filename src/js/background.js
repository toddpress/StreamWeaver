(function() { 
	
	var POLLING_INTERVAL = 10000;

	var poller = {
		streamsArray: [],

		_fails: 0,
		
		_interval: POLLING_INTERVAL,

		init: function() {
			setTimeout(
				$.proxy(this._getStreams, this),
				this._interval
			);
		},

		_getStreams: function() {
			var self = this;
			$.getJSON('https://api.stre.am:9443/v1/stream')
				.done(function(data, textStatus, jqXHR) {
					streams = data.stream;

					// Handle success and recurse
					self._handleSucces(streams);
					self.init();
				})
				.fail(function(jqXHR, textStatus, error) {
					var err = "ERROR: "+ textStatus + " status \r\n\tdetails: "+ error;
					console.log(err);

					// @question: is this call redundant, since we're calling JQuery.proxy() 
					// below. Is the function returned AND exexuted, or is the function just provided with 
					// an appropriate context for the 'this' keyword.
					self._handleError(); 

					$.proxy(self._handleError, self);					
				});
		},

		_handleSucces: function() {
			// @todo: refine this function such that where only dispatching "updated-streams"
			// msg when streams or stream properties have *actually* changed.

			chrome.runtime.sendMessage({ value: streams, key: 'updated-streams' });
			this.streamsArray = streams;

			// @DEV: remove when appropriate
			console.log(JSON.stringify(this.streamsArray, null, 4));
		},

		_notify: function(stream) {
			// @note: not currently implemented but will serve to alert user when
			// unseen stream has begun. unseen streams count will be cleared when 
			// extension popup has been opened. The browser action button will display
			// a count of unseen streams vs. total streams (i.e. "2/5");

			var username = stream.username;

			var notification = window.webkitNotifications.createHTMLNotification(
					'../img/new-stream.png',
					'New Stream!',
					username + ' is streaming! Check it out.'
				);
			notification.show();
		},

		_handleError: function() {
			if (++this._fails < 10) {
				this._interval += 1000;

				// back to it; recurse
				this.init();
			}
		}
	}

	// start dat bitch
	poller.init();

})();