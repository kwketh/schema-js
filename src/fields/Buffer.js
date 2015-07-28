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

	assertSpace: function(bytes) {
		if (this.offset + bytes >= this.getLength()) {
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