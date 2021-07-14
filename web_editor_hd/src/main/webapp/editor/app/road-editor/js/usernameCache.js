var cache;
try {
	cache = JSON.parse(localStorage.getItem('unc')) || [];
} catch (e) {
	cache = [];
}
iD.UsernameCache = {
	_cache: cache,
	push: function(username) {
		var cache = this._cache;
		cache.forEach(function(value, index) {
			if (value === username) {
				cache.splice(index, 1);
				return;
			}
		});
		if (cache.length >= 5) {
			var cache = cache.slice(0, 4);
		}
		cache.unshift(username);
		try {
			localStorage.setItem('unc', JSON.stringify(cache));
		} catch (e) {

		}
	},
	search: function(key) {
		var cache = this._cache;
		return cache.filter(function(item) {
			if (item && item.indexOf(key) === 0) {
				return true;
			}
		});
	} 
}

iD.User.on('login.usernamecache', function() {
	var username = iD.User.getInfo().username;
	iD.UsernameCache.push(username);
});

