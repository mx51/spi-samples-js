// Element value getter methods
function getElementValue(elementSelector: string) {
  const element = document.querySelector(elementSelector);
  return element ? (element as HTMLInputElement).value : '';
}

function getElementCheckboxValue(elementSelector: string) {
  const element = document.querySelector(elementSelector);
  return element ? (element as HTMLInputElement).checked : false;
}

function getElementNumberValue(elementSelector: string) {
  const value = getElementValue(elementSelector);
  return value ? parseInt(value, 10) : 0;
}

// Cleans RTF strings so that the terminal will accept them
function sanitizePrintText(printText: string) {
  let sanitizedText = printText.replace('\\emphasis', 'emphasis');
  sanitizedText = sanitizedText.replace('\\clear', 'clear');
  return sanitizedText.replace('\r\n', '\n');
}

function getElementSanitizedValue(elementSelector: string) {
  return sanitizePrintText(getElementValue(elementSelector));
}

function getSpiVersion(): string | null | undefined {
  const versionMetaEl = document.querySelector('meta[name="ap.version"]');
  return versionMetaEl ? versionMetaEl.getAttribute('content') : undefined;
}

export {
  getSpiVersion,
  getElementValue,
  getElementSanitizedValue,
  getElementCheckboxValue,
  getElementNumberValue,
  sanitizePrintText,
};
