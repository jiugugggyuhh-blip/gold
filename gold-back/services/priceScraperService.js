const axios = require('axios');
const cheerio = require('cheerio');

const SOURCE_URL = 'https://tajnoghreh.com/silver-price/';

function toEnglishDigits(str) {
    if (!str) return '';
    return str
        .replace(/[۰-۹]/g, c => String(c.charCodeAt(0) - 0x06F0))
        .replace(/[٠-٩]/g, c => String(c.charCodeAt(0) - 0x0660));
}

function parsePrice(text) {
    const normalized = toEnglishDigits(text || '');
    const cleaned = normalized.replace(/[^\d]/g, '');
    return parseInt(cleaned, 10) || 0;
}

async function scrapeAllPrices() {
    const response = await axios.get(SOURCE_URL, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        timeout: 15000
    });

    const $ = cheerio.load(response.data);
    const result = {};

    $('tr.sheyda_hamarz_table_item').each((i, el) => {
        const label = $(el).find('[data-column="label"]').text().trim();
        const priceText = $(el).find('[data-column="price"]').text().trim();
        const price = parsePrice(priceText);
        if (label && price > 0) result[label] = price;
    });

    return result;
}

module.exports = { scrapeAllPrices };
