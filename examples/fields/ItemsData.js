"use strict";
schemajs.getFactory().registerField({
	type: 'ItemsData',
	extends: 'Group',
	fields: [
		{
			id: 'signature', 
			type: 'UInt32'
		},
		{
			id: 'categorySize', 
			type: 'Array',
			options: {
				itemType: 'UInt16',
				length: ThingLastCategory
			},
		},
		{
			id: 'categoryData', 
			type: 'Array',
			options: {
				itemType: 'Array',
				itemOptions: {
					itemType: 'ItemInfo',
				},
				length: ThingLastCategory
			},
		},
	],

	fromBuffer: function(buffer) {
		var signature = this.lookup('signature');
		var categorySize = this.lookup('categorySize');
		var categoryData = this.lookup('categoryData');

		signature.fromBuffer(buffer);
		categorySize.fromBuffer(buffer);

		categoryData.toArray().forEach(function(itemInfoArray, categoryIndex) {
			var length = categorySize.at(categoryIndex).value;
			if (categoryIndex == ThingCategoryCreature) {
				length += 1;
			}
			itemInfoArray.resize(length);
		});

		var categories = categoryData.toArray();
		categories.forEach(function(category, categoryId) {						
			var firstId = 1;
			if (categoryId == ThingCategoryItem) {
				firstId = 100;
			} 
			else if (categoryId == ThingCategoryCreature) {
				firstId = 0;
			}
			var items = category.toArray();
			for (var id = firstId; id < items.length; id++) {
				var item = items[id];
				item.id = id;
				item.category = categoryId;
				item.fromBuffer(buffer);
			};
		});
	},

	toBuffer: function(buffer) {
		this.lookup('signature').toBuffer(buffer);
		this.lookup('categorySize').toBuffer(buffer);
		var categoryData = this.lookup('categoryData');
		var categories = categoryData.toArray();
		categories.forEach(function(category, categoryId) {						
			var firstId = 1;
			if (categoryId == ThingCategoryItem) {
				firstId = 100;
			} 
			else if (categoryId == ThingCategoryCreature) {
				firstId = 0;
			}
			var items = category.toArray();
			for (var id = firstId; id < items.length; id++) {
				var item = items[id];
				item.id = id;
				item.category = categoryId;
				item.toBuffer(buffer);
			};
		});
	},
});