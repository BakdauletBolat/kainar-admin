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


/**
 * Функция для форматирования даты "как давно" по принципу:
 *  - до 1 минуты назад: "только что"
 *  - до 60 минут назад: "N минут назад"
 *  - до 24 часов назад: "N часов назад"
 *  - до 7 дней назад: "N дней назад"
 *  - больше недели назад: "ДД ММММ ГГГГ ЧЧ:ММ"
 *
 * @param inputDate Дата (Date-объект или число-таймстемп)
 * @returns Строка формата "только что", "N минут назад", "N часов назад" и т.д.
 */
export function timeAgo(inputDate: Date | number): string {
    const date = inputDate instanceof Date ? inputDate : new Date(inputDate);

    const now = new Date();
    const diffMs = now.getTime() - date.getTime(); // разница в миллисекундах
    const diffSec = Math.floor(diffMs / 1000); // разница в секундах
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    // 1) до 1 минуты назад
    if (diffMin < 1) {
        return 'только что';
    }

    // 2) до 60 минут
    if (diffMin < 60) {
        return `${diffMin} ${pluralize(diffMin, [
            'минута назад',
            'минуты назад',
            'минут назад',
        ])}`;
    }

    // 3) до 24 часов
    if (diffHours < 24) {
        return `${diffHours} ${pluralize(diffHours, [
            'час назад',
            'часа назад',
            'часов назад',
        ])}`;
    }

    // 4) до 7 дней
    if (diffDays < 7) {
        return `${diffDays} ${pluralize(diffDays, [
            'день назад',
            'дня назад',
            'дней назад',
        ])}`;
    }

    // 5) больше недели – показываем полную дату
    return formatFullDate(date);
}

/**
 * Функция для склонения слов: "1 минута", "2 минуты", "5 минут" и т.д.
 * В forms должны прийти три формы слова в порядке:
 *   1) "минута назад"
 *   2) "минуты назад"
 *   3) "минут назад"
 *
 * Аналогично для "час/часа/часов" и "день/дня/дней".
 */
function pluralize(num: number, forms: [string, string, string]): string {
    const n = Math.abs(num) % 100;
    const n1 = n % 10;

    if (n > 10 && n < 20) {
        return forms[2];
    }
    if (n1 > 1 && n1 < 5) {
        return forms[1];
    }
    if (n1 === 1) {
        return forms[0];
    }
    return forms[2];
}

/**
 * Вспомогательная функция для форматирования даты в виде "27 января 2025 14:45".
 * Можно дополнять или использовать Intl.DateTimeFormat.
 */
function formatFullDate(date: Date): string {
    const months = [
        'января',
        'февраля',
        'марта',
        'апреля',
        'мая',
        'июня',
        'июля',
        'августа',
        'сентября',
        'октября',
        'ноября',
        'декабря',
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day} ${month} ${year} ${hours}:${minutes}`;
}