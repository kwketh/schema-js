!function(){var t,e=window.schemajs={};e.getFactory=function(){return t||(t=new e.Factory),t}}(),define(function(){function t(e,i){var s=e[0],r=e.slice(1),n=function(){t(r,i)};require(s,r.length?n:i)}var e={};return e.load=function(e,i){e||(e={});var s=["schemajs/fields/Buffer","schemajs/fields/Group","schemajs/fields/Array","schemajs/fields/UInt32","schemajs/fields/UInt16","schemajs/fields/UInt8"],r=s.concat(e.fields||[]);t([["schemajs/init"],["schemajs/utils/Class","schemajs/core/Factory","schemajs/core/Field"],r],function(){i()})},e}),function(){var t=function(){};t.prototype.init=function(){},t.prototype.type="Class",t.extend=function(e){var i=function(){arguments[0]!==t&&(this.init.$&&this.init.$.init.apply(this,arguments),this.init.apply(this,arguments))},s=new this(t),r=this.prototype;this.prototype["super"]=function(){var t=arguments.callee.caller;return t.arguments.callee.$};for(var n in e){var f=e[n];f instanceof Function&&(f.$=r),s[n]=f}return e.classInit&&e.classInit.call(s),i.prototype=s,i.extend=this.extend,i},schemajs.Class=t}(),function(){var t=schemajs.Class.extend({init:function(){this.registry={}},registerField:function(t){if(!t.type)throw new Error("field definition must have type");var e=schemajs.Field;if(t["extends"]&&(e=this.registry[t["extends"]],!e))throw new Error("field "+t["extends"]+" has not been registered");this.registry[t.type]=e.extend(t)},createField:function(t,e){if(!t)throw new Error("type must be provided");var i=this.registry[t];if(!i)throw new Error("field "+t+" has not been registered");e||(e={});var s=i.prototype.options;if(s)for(var r in s)void 0===e[r]&&(e[r]=s[r]);return new i(e)}});schemajs.Factory=t}(),function(){var t=schemajs.Class.extend({type:"Field",init:function(t){this.options=t}});schemajs.Field=t}(),schemajs.getFactory().registerField({type:"Buffer",options:{length:0,isBigEndian:!1},init:function(t){this.length=t.length,this.buffer=new Uint8Array(this.length),this.offset=0},getLength:function(){return this.buffer.length},fromUrl:function(t,e){var i=this,s=new XMLHttpRequest;s.open("GET",t,!0),s.responseType="arraybuffer",s.onload=function(t){i.buffer=new Uint8Array(this.response),e()},s.send()},trim:function(){this.buffer=this.buffer.subarray(0,this.offset)},createBlob:function(){return new Blob([this.buffer],{type:"application/octet-binary"})},assertSpace:function(t){if(this.offset+t>this.getLength())throw new Error("Buffer read is out of range")},peakU8:function(){var t=this.buffer[this.offset];return t},readU8:function(){this.assertSpace(1);var t=this.buffer[this.offset];return this.offset+=1,t},readU16:function(){this.assertSpace(2);var t,e=this.offset;return this.options.isBigEndian?(t=this.buffer[e]<<8,t|=this.buffer[e+1]):(t=this.buffer[e],t|=this.buffer[e+1]<<8),this.offset+=2,t},readU32:function(){this.assertSpace(4);var t,e=this.offset;return this.options.isBigEndian?(t=this.buffer[e+1]<<16,t|=this.buffer[e+2]<<8,t|=this.buffer[e+3],t+=this.buffer[e]<<24>>>0):(t=this.buffer[e+2]<<16,t|=this.buffer[e+1]<<8,t|=this.buffer[e],t+=this.buffer[e+3]<<24>>>0),this.offset+=4,t},writeU8:function(t){this.assertSpace(1),this.buffer[this.offset]=t,this.offset+=1},writeU16:function(t){this.assertSpace(2),this.options.isBigEndian?(this.buffer[this.offset]=(65280&t)>>>8,this.buffer[this.offset+1]=255&t):(this.buffer[this.offset]=255&t,this.buffer[this.offset+1]=(65280&t)>>>8),this.offset+=2},writeU32:function(t){this.assertSpace(4);var e=this.offset;this.options.isBigEndian?(this.buffer[e]=t>>>24&255,this.buffer[e+1]=t>>>16&255,this.buffer[e+2]=t>>>8&255,this.buffer[e+3]=255&t):(this.buffer[e+3]=t>>>24&255,this.buffer[e+2]=t>>>16&255,this.buffer[e+1]=t>>>8&255,this.buffer[e]=255&t),this.offset+=4},rewind:function(){this.offset=0}}),schemajs.getFactory().registerField({type:"Array",options:{length:0,itemType:void 0,itemOptions:void 0},init:function(t){if(!t.itemType)throw new Error("`options.itemType` must be provided");this._items=[],this.length=t.length,this.resize(this.length)},isSet:function(){return!0},at:function(t){if(t>=this.length)throw new Error("access out of bounds in Field.Array");return this._items[t]},resize:function(t){var e=this.options,i=schemajs.getFactory();for(this.length=t,this._items=this._items.slice(0,this.length);this._items.length<this.length;){var s=i.createField(e.itemType,e.itemOptions);this._items.push(s)}},toArray:function(){return this._items},fromJSON:function(t){this.resize(t.length),t.forEach(function(t,e){var i=this.at(e);i.fromJSON(t)},this)},toJSON:function(){return this._items.map(function(t){return t.toJSON()})},fromBuffer:function(t){0==this.length&&console.warn("unserializing array with zero length"),this._items.forEach(function(e){e.fromBuffer(t)},this)},toBuffer:function(t){0==this.length&&console.warn("serializing array with zero length"),this._items.forEach(function(e){e.toBuffer(t)},this)}}),schemajs.getFactory().registerField({type:"Group",fields:[],init:function(t){var e=t.fields||this.fields;this._createFields(e)},lookup:function(t){return this._fields[t]},hasFields:function(){return Object.keys(this._fields).length>0},isSet:function(){for(var t in this._fields){var e=this._fields[t];if(e.isSet())return!0}return!1},fromBuffer:function(t){this.hasFields()||console.warn("unserializing array with no fields");for(var e in this._fields){var i=this._fields[e];i.fromBuffer(t)}},toBuffer:function(t){this.hasFields()||console.warn("serializing array with no fields");for(var e in this._fields){var i=this._fields[e];i.toBuffer(t)}},toJSON:function(){var t={};for(var e in this._fields){var i=this._fields[e];i.isSet()&&(t[e]=i.toJSON())}return t},fromJSON:function(t){for(var e in t){var i=t[e];this._fields[e].fromJSON(i)}},toObject:function(){return this._fields},_createField:function(t){var e=schemajs.getFactory();if(this.lookup(t.id))throw new Error("duplicate field id `"+t.id+"` in Group");this._fields[t.id]=e.createField(t.type,t.options)},_createFields:function(t){this._fields={};for(var e=0;e<t.length;e++){var i=t[e];this._createField(i)}}}),schemajs.getFactory().registerField({type:"UInt32",options:{defaultValue:void 0},init:function(t){this.value=t.defaultValue},isSet:function(){return void 0!==this.value},fromBuffer:function(t){this.value=t.readU32()},toBuffer:function(t){t.writeU32(this.value)},toJSON:function(){return this.value},fromJSON:function(t){this.value=t},valueOf:function(){return this.value}}),schemajs.getFactory().registerField({type:"UInt16",options:{defaultValue:void 0},init:function(t){this.value=t.defaultValue},isSet:function(){return void 0!==this.value},fromBuffer:function(t){this.value=t.readU16()},toBuffer:function(t){t.writeU16(this.value)},toJSON:function(){return this.value},fromJSON:function(t){this.value=t},valueOf:function(){return this.value}}),schemajs.getFactory().registerField({type:"UInt8",options:{defaultValue:void 0},init:function(t){this.value=t.defaultValue},isSet:function(){return void 0!==this.value},fromBuffer:function(t){this.value=t.readU8()},toBuffer:function(t){t.writeU8(this.value)},toJSON:function(){return this.value},fromJSON:function(t){this.value=t},valueOf:function(){return this.value}});