import { useState, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';
import API_ENDPOINTS from '../utils/apiEndpoints';

const useTodayHabitInsert = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const insertTodayHabits = useCallback(async (studyId, habits) => {
    if (!studyId) {
      console.log(`useTodayHabitInsert: no studyId provided: ${studyId}`);
      setError('studyId is required');
      return { success: false, error: 'studyId is required' };
    }

    if (!habits || !Array.isArray(habits) || habits.length === 0) {
      console.log(`useTodayHabitInsert: no habits provided`);
      setError('habits array is required');
      return { success: false, error: 'habits array is required' };
    }
    
    try {
      setLoading(true);
      setSuccess(false);
      setError(null);
      
      const habitNames = habits.map(habit => habit.name).filter(name => name && name.trim());
      
      console.log(`useTodayHabitInsert: inserting today's habits, API: ${API_ENDPOINTS.HABITS.CREATE(studyId)}`);
      console.log(`useTodayHabitInsert: habit_names to send:`, habitNames);
      
      const response = await axiosInstance.post(API_ENDPOINTS.HABITS.CREATE(studyId), {
        habit_names: habitNames,
      });
      
      console.log(`useTodayHabitInsert: today's habits response: ${response.data}`);
      const responseData = response.data || {};
      console.log(`useTodayHabitInsert: today's habits data insertion completed: ${JSON.stringify(responseData)}`);
      
      setSuccess(true);
      return { success: true, data: responseData };
    } catch (error) {
      console.error(`useTodayHabitInsert: today's habits insertion failed: ${error}`);
      console.error(`useTodayHabitInsert: error details: ${error.response?.data || error.message}`);
      setError(error.response?.data || error.message);
      setSuccess(false);
      return { success: false, error: error.response?.data || error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    success,
    error,
    insertTodayHabits,
  };
};

export default useTodayHabitInsert;

