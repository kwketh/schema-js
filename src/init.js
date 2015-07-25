(function() {
	var schemajs = window.schemajs = {};
	var factory;

	/**
	 * Creates a factory singleton and returns it.
	 * @returns the factory {schemajs.Factory}
	 */
	schemajs.getFactory = function() {
		factory || (factory = new schemajs.Factory());
		return factory;
	}
})();