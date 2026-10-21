// All app settings live here, so they are easy to change in one place.

// Gemini model name (change only this line if the model changes)
export const GEMINI_MODEL = 'gemini-3.8-flash';

// Limits to protect the free quota
export const MAX_INPUT_CHARS = 5000;
export const MIN_INPUT_CHARS = 20;
export const DAILY_LIMIT_PER_DEVICE = 100;