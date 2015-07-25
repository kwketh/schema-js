(function() {
	var Factory = schemajs.Class.extend({
		init: function() {
			this.registry = {};
		},
		registerField: function(definition) {			
			if (!definition.type) {
				throw new Error('field definition must have type');
			}
			var superClass = schemajs.Field;
			if (definition.extends) {
				superClass = this.registry[definition.extends];
				if (!superClass) {
					throw new Error('field ' + definition.extends + ' has not been registered');
				}
			}		
			this.registry[definition.type] = superClass.extend(definition);
		},
		createField: function(type, options) {
			if (!type) {
				throw new Error('type must be provided');
			}
			var classInstance = this.registry[type];
			if (!classInstance) {
				throw new Error('field ' + type + ' has not been registered');
			}
			options || (options = {});
			return new classInstance(options);
		},
	});
	schemajs.Factory = Factory;
})();