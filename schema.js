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
			var baseOptions = classInstance.prototype.options;
			if (baseOptions) {
				for (var key in baseOptions) {
					if (options[key] === undefined) {
						options[key] = baseOptions[key];
					}
				}
			}
			return new classInstance(options);
		},
	});
	schemajs.Factory = Factory;
})();
(function() {
	var Field = schemajs.Class.extend({
		type: 'Field',
		init: function(options) {
			this.options = options;
		},
	});
	schemajs.Field = Field;
})();
schemajs.getFactory().registerField({
	type: 'Buffer',

	options: {
		length: 0,
		isBigEndian: false,
	},

	init: function(options) {
		this.length = options.length;
		this.buffer = new Uint8Array(this.length);
		this.offset = 0;
	},

	getLength: function() {
		return this.buffer.length;
	},

	fromUrl: function(url, callback) {
		var field = this;
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.responseType = 'arraybuffer';
		xhr.onload = function(e) {
			field.buffer = new Uint8Array(this.response);
			callback();
		};
		xhr.send();
	},	

	trim: function() {
		this.buffer = this.buffer.subarray(0, this.offset);
	},

	createBlob: function() {
		return new Blob([this.buffer], {type: 'application/octet-binary'});
	},

	assertSpace: function(bytes) {
		if (this.offset + bytes > this.getLength()) {
			throw new Error('Buffer read is out of range');
		}
	},

	peakU8: function() {
		var value = this.buffer[this.offset];
		return value;
	},

	readU8: function() {
		this.assertSpace(1);
		var value = this.buffer[this.offset];
		this.offset += 1;
		return value;
	},

	readU16: function() {
		this.assertSpace(2);
		var value;
		var offset = this.offset;
		if (this.options.isBigEndian) {
			value = this.buffer[offset] << 8;
			value |= this.buffer[offset + 1];
		} else {
			value = this.buffer[offset];
			value |= this.buffer[offset + 1] << 8;
		}
		this.offset += 2;
		return value;
	},

	readU32: function() {
		this.assertSpace(4);		
		var value;		
		var offset = this.offset;
		if (this.options.isBigEndian) {
            value = this.buffer[offset + 1] << 16;
            value |= this.buffer[offset + 2] << 8;
            value |= this.buffer[offset + 3];
            value = value + (this.buffer[offset] << 24 >>> 0);
		} else {
            value = this.buffer[offset + 2] << 16;
            value |= this.buffer[offset + 1] << 8;
            value |= this.buffer[offset];
            value = value + (this.buffer[offset + 3] << 24 >>> 0);
		}
		this.offset += 4;
		return value;
	},	

	writeU8: function(value) {
		this.assertSpace(1);
		this.buffer[this.offset] = value;
		this.offset += 1;
	},

	writeU16: function(value) {
		this.assertSpace(2);
		if (this.options.isBigEndian) {
			this.buffer[this.offset] = (value & 0xff00) >>> 8;
			this.buffer[this.offset + 1] = value & 0x00ff;
		} else {			
			this.buffer[this.offset] = value & 0x00ff;
			this.buffer[this.offset + 1] = (value & 0xff00) >>> 8;
		}
		this.offset += 2;
	},

	writeU32: function(value) {
		this.assertSpace(4);
		var offset = this.offset;
		if (this.options.isBigEndian) {
            this.buffer[offset] = (value >>> 24) & 0xff;
            this.buffer[offset + 1] = (value >>> 16) & 0xff;
            this.buffer[offset + 2] = (value >>> 8) & 0xff;
            this.buffer[offset + 3] = value & 0xff;
		} else {			
            this.buffer[offset + 3] = (value >>> 24) & 0xff;
            this.buffer[offset + 2] = (value >>> 16) & 0xff;
            this.buffer[offset + 1] = (value >>> 8) & 0xff;
            this.buffer[offset] = value & 0xff;
		}
		this.offset += 4;
	},	

	rewind: function() {
		this.offset = 0;
	},
});
schemajs.getFactory().registerField({
	type: 'Array',

	options: {
		length: 0,
		itemType: undefined,
		itemOptions: undefined,
	},

	init: function(options) {
		if (!options.itemType) {
			throw new Error('`options.itemType` must be provided');
		}
		this._items = [];
		this.length = options.length;
		this.resize(this.length);
	},

	isSet: function() {
		return true;
	},

	at: function(index) {
		if (index >= this.length) {
			throw new Error('access out of bounds in Field.Array');
		}
		return this._items[index];
	},

	resize: function(length) {
		var options = this.options;
		var factory = schemajs.getFactory();
		this.length = length;
		this._items = this._items.slice(0, this.length);
		while (this._items.length < this.length) {
			var field = factory.createField(options.itemType, options.itemOptions);		
			this._items.push(field);
		}
	},
	
	toArray: function() {
		return this._items;
	},

	fromJSON: function(json) {
		this.resize(json.length);
		json.forEach(function(item, index) {
			var field = this.at(index);
			field.fromJSON(item);
		}, this);
	},

	toJSON: function() {
		return this._items.map(function(item) {
			return item.toJSON();
		});
	},

	fromBuffer: function(buffer) {
		if (this.length == 0) {
			console.warn('unserializing array with zero length');
		}
		this._items.forEach(function(item) {
			item.fromBuffer(buffer);
		}, this);
	},

	toBuffer: function(buffer) {
		if (this.length == 0) {
			console.warn('serializing array with zero length');
		}
		this._items.forEach(function(item) {
			item.toBuffer(buffer);
		}, this);
	},	
});
schemajs.getFactory().registerField({
	type: 'Group',
	fields: [],

	init: function(options) {
		var fields = options.fields || this.fields;
		this._createFields(fields);
	},

	lookup: function(fieldId) {
		return this._fields[fieldId];
	},

	hasFields: function() {
		return Object.keys(this._fields).length > 0;
	},

	isSet: function() {
		for (var key in this._fields) {
			var field = this._fields[key];
			if (field.isSet()) {
				return true;
			}
		}
		return false;
	},

	fromBuffer: function(buffer) {
		if (!this.hasFields()) {
			console.warn('unserializing array with no fields');
		}
		for (var key in this._fields) {
			var field = this._fields[key];
			field.fromBuffer(buffer);
		}
	},

	toBuffer: function(buffer) {
		if (!this.hasFields()) {
			console.warn('serializing array with no fields');
		}
		for (var key in this._fields) {
			var field = this._fields[key];
			field.toBuffer(buffer);
		}
	},

	toJSON: function() {
		var json = {};
		for (var key in this._fields) {
			var field = this._fields[key];
			if (field.isSet()) {
				json[key] = field.toJSON();
			}
		}
		return json;
	},

	fromJSON: function(json) {
		for (var key in json) {
			var value = json[key];
			this._fields[key].fromJSON(value);
		}
	},	

	toObject: function() {
		return this._fields;
	},

	_createField: function(fieldSchema) {
		var factory = schemajs.getFactory();
		if (this.lookup(fieldSchema.id)) {
			throw new Error('duplicate field id `' + fieldSchema.id + '` in Group');
		}
		this._fields[fieldSchema.id] = factory.createField(fieldSchema.type, fieldSchema.options);
	},

	_createFields: function(allFields) {
		this._fields = {};
		for (var i = 0; i < allFields.length; i++) {
			var fieldSchema = allFields[i];
			this._createField(fieldSchema);
		}
	},		
});
schemajs.getFactory().registerField({
	type: 'UInt32',

	options: {
		defaultValue: undefined,
	},

	init: function(options) {
		this.value = options.defaultValue;
	},

	isSet: function(){
		return this.value !== undefined;
	},
	
	fromBuffer: function(buffer) {
		this.value = buffer.readU32();
	},

	toBuffer: function(buffer) {
		buffer.writeU32(this.value);
	},	

	toJSON: function() {
		return this.value;
	},

	fromJSON: function(value) {
		this.value = value;	
	},	
	
	valueOf: function() {
		return this.value;
	},	
});
schemajs.getFactory().registerField({
	type: 'UInt16',

	options: {
		defaultValue: undefined,
	},

	init: function(options) {
		this.value = options.defaultValue;
	},

	isSet: function(){
		return this.value !== undefined;
	},

	fromBuffer: function(buffer) {
		this.value = buffer.readU16();
	},

	toBuffer: function(buffer) {
		buffer.writeU16(this.value);
	},	

	toJSON: function() {
		return this.value;
	},
	
	fromJSON: function(value) {
		this.value = value;	
	},
	
	valueOf: function() {
		return this.value;
	},	
});
schemajs.getFactory().registerField({
	type: 'UInt8',

	options: {
		defaultValue: undefined,
	},

	init: function(options) {
		this.value = options.defaultValue;
	},

	isSet: function(){
		return this.value !== undefined;
	},
	
	fromBuffer: function(buffer) {
		this.value = buffer.readU8();
	},

	toBuffer: function(buffer) {
		buffer.writeU8(this.value);
	},

	toJSON: function() {
		return this.value;
	},

	fromJSON: function(value) {
		this.value = value;	
	},

	valueOf: function() {
		return this.value;
	},
});