(function() {
	var Class = function() { };
	Class.prototype.init = function() { };
	Class.prototype.type = 'Class';
	Class.extend = function(definition) {
		var classDef = function() {
			if (arguments[0] !== Class) {
				if (this.init.$) {
					this.init.$.init.apply(this, arguments);
				}
				this.init.apply(this, arguments);
			}
		};
		var prototype = new this(Class);
		var superClass = this.prototype;
		this.prototype.super = function() {
			var caller = arguments.callee.caller;
			return caller.arguments.callee.$;
		};
		for (var n in definition) {
			var item = definition[n];
			if (item instanceof Function) {
				item.$ = superClass;
			}
			prototype[n] = item;
		}
		if (definition.classInit) {
			definition.classInit.call(prototype);
		}		
		classDef.prototype = prototype;
		classDef.extend = this.extend;
		return classDef;
	};
	schemajs.Class = Class;
})();