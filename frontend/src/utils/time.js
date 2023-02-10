export function parseTime(time, date = null) {
	const newDate = new Date(Date.now());

	const split = time.split(":").map((item) => parseInt(item));

	newDate.setHours(split[0], split[1]);

	return newDate;
}
