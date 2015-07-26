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
			var items = category.toArray();			
			items.forEach(function(item, id) {
				if (categoryId == ThingCategoryItem && id < 100) {
					return;					
				} else if (categoryId != ThingCategoryCreature && id < 1) {
					return;
				}
				item.id = id;
				item.category = categoryId;
				item.fromBuffer(buffer);
			});
		});
		
		assert(buffer.offset == 249344, 'offset mismatch');
	},
});