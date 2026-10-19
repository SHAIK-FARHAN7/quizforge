const STORAGE_KEY = 'quizforge_device_id';

// Returns the device ID. Creates and saves a new one on the first visit.
export function getDeviceId() {
  try {
    let id = localStorage.getItem(STORAGE_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  } catch {
    // If the browser blocks storage, use a temporary ID for this visit
    return `temp-${Math.random().toString(36).slice(2)}`;
  }
}