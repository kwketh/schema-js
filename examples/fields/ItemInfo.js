"use strict";
schemajs.getFactory().registerField({
	type: 'ItemInfo',
	extends: 'Group',
	fields: [
		{
			id: 'attrs',
			type: 'ItemAttrs'
		},
		{
			id: 'width',
			type: 'UInt8'
		},
		{
			id: 'height',
			type: 'UInt8'
		},
		{
			id: 'size',
			type: 'UInt8'
		},		
		{
			id: 'layers',
			type: 'UInt8'
		},
		{
			id: 'patterns',
			type: 'Group',
			options: {
				fields: [
					{id: 'x', type: 'UInt8'},
					{id: 'y', type: 'UInt8'},
					{id: 'z', type: 'UInt8'}
				]
			}
		},
		{
			id: 'animationPhases',
			type: 'UInt8',
		},
		{
			id: 'spriteIds',
			type: 'Array',
			options: {
				itemType: 'UInt16'
			},
		}		
	],
	
	init: function(options) {
		this.id = 0;
		this.category = 4; // ThingInvalidCategory
	},

	getArea: function() {
		var width = this.lookup('width');
		var height = this.lookup('height');
		return width * height;
	},

	getTotalSprites: function() {
		var width = this.lookup('width');
		var height = this.lookup('height');
		var layers = this.lookup('layers');
		var patterns = this.lookup('patterns').toObject();
		var animationPhases = this.lookup('animationPhases');
		return width * height * layers * animationPhases *
		       patterns.x * patterns.y * patterns.z;
	},

	fromBuffer: function(buffer) {
		this.lookup('attrs').fromBuffer(buffer);
		this.lookup('width').fromBuffer(buffer);
		this.lookup('height').fromBuffer(buffer);
		if (this.getArea() > 1) {
			this.lookup('size').fromBuffer(buffer);
		}
		this.lookup('layers').fromBuffer(buffer);
		this.lookup('patterns').fromBuffer(buffer);
		this.lookup('animationPhases').fromBuffer(buffer);
		var totalSprites = this.getTotalSprites();
		this.lookup('spriteIds').resize(totalSprites);
		this.lookup('spriteIds').fromBuffer(buffer);
	},

	toBuffer: function(buffer) {
		this.lookup('attrs').toBuffer(buffer);
		this.lookup('width').toBuffer(buffer);
		this.lookup('height').toBuffer(buffer);
		if (this.getArea() > 1) {
			this.lookup('size').toBuffer(buffer);
		}
		this.lookup('layers').toBuffer(buffer);
		this.lookup('patterns').toBuffer(buffer);
		this.lookup('animationPhases').toBuffer(buffer);
		this.lookup('spriteIds').toBuffer(buffer);
	},	
});