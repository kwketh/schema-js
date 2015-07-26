(function() {
	var Field = schemajs.Class.extend({
		type: 'Field',
		init: function(options) {
			this.options = options;
		},
	});
	schemajs.Field = Field;
})();