const STORAGE_KEY = 'recent_study_queue';
const MAX_SIZE = 3;

export const getRecentStudyQueue = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    return [];
  }
};

export const addToRecentStudyQueue = (studyId) => {
  try {
    const queue = getRecentStudyQueue();
    const filteredQueue = queue.filter(id => id !== studyId);
    const newQueue = [studyId, ...filteredQueue];
    const trimmedQueue = newQueue.slice(0, MAX_SIZE);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedQueue));
    return trimmedQueue;
  } catch (error) {
    return [];
  }
};

export const clearRecentStudyQueue = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
  }
};

