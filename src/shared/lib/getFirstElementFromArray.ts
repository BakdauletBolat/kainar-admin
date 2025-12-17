export function getFirstElementArray(list: any[] | null | undefined): any | undefined {
	if (!Array.isArray(list)) return undefined;
	return list.length > 0 ? list[0] : undefined
}
