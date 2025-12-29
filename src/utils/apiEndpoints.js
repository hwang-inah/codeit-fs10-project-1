const API_ENDPOINTS = {
  HEALTH: '/health',
  
  STUDIES: {
    GET_ALL: '/api/studies',
    CREATE: '/api/studies',
    GET_BY_ID: (id) => `/api/studies/${id}`,
    UPDATE: (id) => `/api/studies/${id}`,
    DELETE: (id) => `/api/studies/${id}`,
    UPDATE_CONCENTRATION_TIME: (id) => `/api/studies/${id}/concentration-time`,
    VERIFY_PASSWORD: (id) => `/api/studies/${id}/verify-password`,
    BATCH: '/api/studies/batch',
  },
  
  POINTS: {
    GET_BY_STUDY: (studyId) => `/api/points/study/${studyId}`,
    CREATE: (studyId) => `/api/points/study/${studyId}`,
    DELETE: (studyId, pointId) => `/api/points/study/${studyId}/${pointId}`,
  },
  
  HABITS: {
    GET_ALL: '/api/habits',
    GET_BY_STUDY: (studyId) => `/api/habits/study/${studyId}`,
    CREATE: (studyId) => `/api/habits/study/${studyId}`,
    UPDATE_ALL: (studyId) => `/api/habits/study/${studyId}`,
    UPDATE_SINGLE: (studyId, habitId) => `/api/habits/study/${studyId}/${habitId}`,
    DELETE: (studyId, habitId) => `/api/habits/study/${studyId}/${habitId}`,
    GET_TODAY: (studyId) => `/api/habits/study/${studyId}/today`,
    GET_WEEK: (studyId) => `/api/habits/study/${studyId}/week`,
    CREATE_FULFILLMENT: (studyId, habitId) => `/api/habits/study/${studyId}/${habitId}/fullfillment`,
    DELETE_FULFILLMENT: (fulfillmentId) => `/api/habits/fullfillments/${fulfillmentId}`,
  },
  
  EMOJIS: {
    GET_BY_STUDY: (studyId) => `/api/emojis/study/${studyId}`,
    CREATE: '/api/emojis',
    INCREMENT: (emojiId) => `/api/emojis/${emojiId}/increment`,
    DELETE: (emojiId) => `/api/emojis/${emojiId}`,
  },
};

export default API_ENDPOINTS;
