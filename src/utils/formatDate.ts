export function formatDate(date?: Date | string) {
    if (date == undefined) {
        return '-'
    }

    if (typeof date === "string") {
        const d = Date.parse(date);
        date = new Date(d);
    }
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}