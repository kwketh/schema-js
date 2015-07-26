function assert(value, message) {
	if (value === undefined || value === null || value === false) {
		throw new Error(message);
	}
}