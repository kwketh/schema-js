"use strict";
schemajs.getFactory().registerField({
	type: 'ItemAttrs',
	extends: 'Group',
	fields: [
		{id: 'ground',          internalId: 0,   type: 'UInt16'},
		{id: 'fullGround',      internalId: 31,  type: 'Flag'},		
		{id: 'groundBorder',    internalId: 1,   type: 'Flag'},
		{id: 'onBottom',        internalId: 2,   type: 'Flag'},
		{id: 'onTop',           internalId: 3,   type: 'Flag'},
		{id: 'container',       internalId: 4,   type: 'Flag'},
		{id: 'fluidContainer',  internalId: 11,  type: 'Flag'},
		{id: 'useable',         internalId: 35,  type: 'Flag'},
		{id: 'stackable',       internalId: 5,   type: 'Flag'},
		{id: 'writableFlag',    internalId: 8,   type: 'Flag'},
		{id: 'writable',        internalId: 9,   type: 'UInt16'},
		{id: 'writableOnce',    internalId: 10,  type: 'UInt16'},
		{id: 'pickupable',      internalId: 17,  type: 'Flag'},
		{id: 'notPathable',     internalId: 16,  type: 'Flag'},
		{id: 'hangable',        internalId: 18,  type: 'Flag'},
		{id: 'rotatable',       internalId: 21,  type: 'Flag'},
		{id: 'dontHide',        internalId: 23,  type: 'Flag'},
		{id: 'translucent',     internalId: 24,  type: 'Flag'},
		{id: 'hookSouth',       internalId: 19,  type: 'Flag'},
		{id: 'hookEast',        internalId: 20,  type: 'Flag'},		
		{id: 'forceUse',        internalId: 6,   type: 'Flag'},
		{id: 'multiUse',        internalId: 7,   type: 'Flag'},
		{id: 'lyingCorpse',     internalId: 27,  type: 'Flag'},
		{id: 'animateAlways',   internalId: 28,  type: 'Flag'},
		{id: 'splash',          internalId: 12,  type: 'Flag'},
		{id: 'notWalkable',     internalId: 13,  type: 'Flag'},
		{id: 'notMoveable',     internalId: 14,  type: 'Flag'},
		{id: 'blockProjectile', internalId: 15,  type: 'Flag'},
		{id: 'minimapColor',    internalId: 29,  type: 'UInt16'},
		{id: 'cloth',           internalId: 33,  type: 'UInt16'},
		{id: 'lensHelp',        internalId: 30,  type: 'UInt16'},
		{id: 'lightIntensity',  internalId: 22,  type: 'UInt16'},
		{id: 'lightColor',      internalId: 22,  type: 'UInt16'},
		{id: 'elevation',       internalId: 26,  type: 'UInt16'},
		{id: 'look',            internalId: 32,  type: 'Flag'},
		{id: 'market',          internalId: 34,  type: 'Flag'},
		{id: 'displacement',    internalId: 25,  type: 'Group', options: { 
			fields: [
				{id: 'x', type: 'UInt16'},
				{id: 'y', type: 'UInt16'},
			]
		}},
	],

	classInit: function() {
		var map = this.internalIdMap = {};
		this.fields.forEach(function(fieldSchema) {
			var internalId = fieldSchema.internalId;
			map[internalId] || (map[internalId] = []);
			map[internalId].push(fieldSchema.id);
		});
	},

	init: function() {
		this.attrs = [];
		this.lookup = this.lookup.bind(this);
	},

	loadAttribute: function(attr, buffer) {
		var fieldIds = this.internalIdMap[attr];
		assert(fieldIds, 'unknown attr = ' + attr);

		var fields = fieldIds.map(this.lookup);
		assert(fields.length > 0, 'no fields for attr = ' + attr);

		fields.forEach(function(field) {
			field.fromBuffer(buffer);
		});
	},

	saveAttribute: function(attr, buffer) {
		var fieldIds = this.internalIdMap[attr];
		var fields = fieldIds.map(this.lookup);	
		assert(fields.length > 0, 'no fields to serialize');		
		fields.forEach(function(field) {
			if (field.type == 'Flag') {					
				/* Nothing */
			} else {
				field.toBuffer(buffer);
			}
		});
	},
	
	fromBuffer: function(buffer) {
		var success = false;
		for (var i = 0; i < ThingLastAttr; i++) {
			/* Reached last attribute, set load as successfull */
			var attr = buffer.readU8();
			if (attr == ThingLastAttr) {
				success = true;
				break;
			}			
			/* Backwards compatibility patch */
			this.attrs.push(attr);
			this.loadAttribute(attr, buffer);			
		}
		assert(success, 'failed to load ItemAttrs');
	},

	toBuffer: function(buffer) {
		this.attrs.forEach(function(attr) {
			buffer.writeU8(attr);
			this.saveAttribute(attr, buffer);
		}, this);
		buffer.writeU8(ThingLastAttr);
	},	
});