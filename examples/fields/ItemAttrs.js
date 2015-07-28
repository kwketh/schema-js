"use strict";
schemajs.getFactory().registerField({
	type: 'ItemAttrs',
	extends: 'Group',
	attrs: {
		'ground':          { internalId: 0,   type: 'UInt16' },
		'groundBorder':    { internalId: 1,   type: 'Flag' },
		'onBottom':        { internalId: 2,   type: 'Flag' },
		'onTop':           { internalId: 3,   type: 'Flag' },
		'container':       { internalId: 4,   type: 'Flag' },
		'stackable':       { internalId: 5,   type: 'Flag' },
		'forceUse':        { internalId: 6,   type: 'Flag' },
		'multiUse':        { internalId: 7,   type: 'Flag' },
		'writableFlag':    { internalId: 8,   type: 'Flag' },
		'writable':        { internalId: 9,   type: 'UInt16' },
		'writableOnce':    { internalId: 10,  type: 'UInt16' },
		'fluidContainer':  { internalId: 11,  type: 'Flag' },
		'splash':          { internalId: 12,  type: 'Flag' },
		'notWalkable':     { internalId: 13,  type: 'Flag' },
		'notMoveable':     { internalId: 14,  type: 'Flag' },
		'blockProjectile': { internalId: 15,  type: 'Flag' },
		'notPathable':     { internalId: 16,  type: 'Flag' },
		'pickupable':      { internalId: 17,  type: 'Flag' },
		'hangable':        { internalId: 18,  type: 'Flag' },
		'hookSouth':       { internalId: 19,  type: 'Flag' },
		'hookEast':        { internalId: 20,  type: 'Flag' },		
		'rotatable':       { internalId: 21,  type: 'Flag' },
		'light':           { internalId: 22,  type: 'Group', options: {
			fields: [
				{id: 'intensity', type: 'UInt16'},
				{id: 'color',     type: 'UInt16'},
			],
		}},
		'dontHide':        { internalId: 23,  type: 'Flag' },
		'translucent':     { internalId: 24,  type: 'Flag' },
		'displacement':    { internalId: 25,  type: 'Group', options: { 
			fields: [
				{id: 'x', type: 'UInt16'},
				{id: 'y', type: 'UInt16'},
			]
		}},
		'elevation':       { internalId: 26,  type: 'UInt16' },
		'lyingCorpse':     { internalId: 27,  type: 'Flag' },
		'animateAlways':   { internalId: 28,  type: 'Flag' },
		'minimapColor':    { internalId: 29,  type: 'UInt16' },
		'lensHelp':        { internalId: 30,  type: 'UInt16' },
		'fullGround':      { internalId: 31,  type: 'Flag' },		
		'look':            { internalId: 32,  type: 'Flag' },
		'cloth':           { internalId: 33,  type: 'UInt16' },
		'market':          { internalId: 34,  type: 'Flag' },
		'useable':         { internalId: 35,  type: 'Flag' },
	},

	classInit: function() {
		var map = this.internalIdMap = {};
		this.fields = [];
		for (var name in this.attrs) {
			var data = this.attrs[name];
			this.fields.push({
				id: name,
				type: 'ItemAttr',
				options: {
					internalId: data.internalId,
					internalType: data.type,
					internalOptions: data.options
				},
			});
			var internalId = data.internalId;
			map[internalId] = name;
		}
	},

	init: function() {
		this.lookup = this.lookup.bind(this);
	},

	getFieldForAttr: function(attr) {
		var fieldId = this.internalIdMap[attr];
		return this.lookup(fieldId);
	},

	fromBuffer: function(buffer) {
		var success = false;
		for (var i = 0; i < ThingLastAttr; i++) {
			var attr = buffer.peakU8();
			if (attr == ThingLastAttr) {
				attr = buffer.readU8();
				success = true;
				break;
			}			
			this.getFieldForAttr(attr).fromBuffer(buffer);
		}
		assert(success, 'failed to load ItemAttrs');
	},

	toBuffer: function(buffer) {
		for (var key in this._fields) {
			var field = this._fields[key];
			if (field.isSet()) {
				field.toBuffer(buffer);
			}
		}
		buffer.writeU8(ThingLastAttr);
	},	
});