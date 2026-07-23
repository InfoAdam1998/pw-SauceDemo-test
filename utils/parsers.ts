export function parsePrice(text: string): number {
    return parseFloat(text.replace(/[^0-9.]/g, ''));
}
