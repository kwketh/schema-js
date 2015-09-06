(function() {
	var Class = function() { };
	Class.prototype.init = function() { };
	Class.prototype.type = 'Class';
	Class.extend = function(definition) {
		var classDef = function(options) {
			if (arguments[0] !== Class) {
				if (this.super) {
					this.super.init.call(this, options);
				}
				this.init.call(this, options);
			}
		};
		var prototype = new this(Class);
		var superClass = this.prototype;
		for (var n in definition) {
			var item = definition[n];
			prototype[n] = item;
		}
		prototype.super = superClass;
		if (definition.classInit) {
			definition.classInit.call(prototype);
		}		
		classDef.prototype = prototype;
		classDef.extend = this.extend;
		return classDef;
	};
	schemajs.Class = Class;
})();