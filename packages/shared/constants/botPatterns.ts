export const botPatterns = [
  'bot',
  'spider',
  'crawl',
  'slurp',
  'headless',
  'wget',
  'curl',
  'lighthouse',
  'puppeteer',
  'phantom',
  'bingbot',
  'googlebot',
  'yandexbot',
  'applebot',
  'baiduspider',
  'duckduckbot',
  'discordbot',
  'facebookexternalhit',
  'linkedinbot',
  'slackbot',
  'telegrambot',
  'twitterbot',
  'whatsapp',
  'skype'
];

export function isBot(userAgent: string | undefined | null): boolean {
  if (!userAgent) return true; // Eğer user-agent yoksa bot kabul edilebilir.
  const ua = userAgent.toLowerCase();
  return botPatterns.some(pattern => ua.includes(pattern));
}
