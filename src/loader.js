define(function() {
	var exports = {};

	function requireGroups(groups, callback) {
		var head = groups[0];
		var tail = groups.slice(1);
		var loadTail = function() { 
			requireGroups(tail, callback);
		};
		require(head, tail.length ? loadTail : callback);
	}

	/**
	 * Loads all classes and fields into global 
	 * 'schemajs' variable.
	 *
	 * @param options {Object}
	 *   additional source files to load can be given
	 *   in 'fields' array.
	 *
	 * @param callback
	 *   if given, callback will be fired when everything
	 *   has been loaded, including all the additional
	 *   source files provided in options.
	 */
	exports.load = function(options, callback) {
		options || (options = {});
		var coreAndUtils = [
			'schemajs/utils/Class',
			'schemajs/core/Factory',
			'schemajs/core/Field'
		];

		var baseFields = [
			'schemajs/fields/Buffer',
			'schemajs/fields/Group',
			'schemajs/fields/Array',
			'schemajs/fields/UInt32',
			'schemajs/fields/UInt16',
			'schemajs/fields/UInt8'
		];

		var loadFields = baseFields.concat(options.fields || []);

		/* Load core files, then all fields and components at the same time */
		requireGroups([
			['schemajs/init'],
			['schemajs/utils/Class', 'schemajs/core/Factory', 'schemajs/core/Field'],
			loadFields
		], function() {
			callback();
		});
	};
	return exports;
});
