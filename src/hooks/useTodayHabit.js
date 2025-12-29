import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';
import API_ENDPOINTS from '../utils/apiEndpoints';
import useHabitByStudyId from './useHabitByStudyId';

const useTodayHabit = (studyId) => {
  const { loading: studyLoading, viewStudyDetailTitle } = useHabitByStudyId(studyId);
  const [loading, setLoading] = useState(true);
  const [todayFulfillments, setTodayFulfillments] = useState([]);

  useEffect(() => {
    const fetchTodayFulfillments = async () => {
      if (!studyId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        try {
          const todayHabitsResponse = await axiosInstance.get(API_ENDPOINTS.HABITS.GET_TODAY(studyId));
          const todayHabitsResponseData = todayHabitsResponse.data || {};
          
          let habitsData = [];
          if (todayHabitsResponseData.success && Array.isArray(todayHabitsResponseData.data)) {
            habitsData = todayHabitsResponseData.data;
          } else if (Array.isArray(todayHabitsResponseData)) {
            habitsData = todayHabitsResponseData;
          } else if (todayHabitsResponseData.habits && Array.isArray(todayHabitsResponseData.habits)) {
            habitsData = todayHabitsResponseData.habits;
          } else if (todayHabitsResponseData.data && Array.isArray(todayHabitsResponseData.data)) {
            habitsData = todayHabitsResponseData.data;
          }
          
          const fulfillments = habitsData
            .filter(habit => habit.hasFullfillment === true)
            .map(habit => ({
              habit_pk: habit.habit_pk || habit.id || habit.habitId,
              fullfillmentCount: habit.fullfillmentCount || 0
            }));
          
          setTodayFulfillments(fulfillments);
        } catch (habitsError) {
          setTodayFulfillments([]);
        }

      } catch (error) {
        setTodayFulfillments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayFulfillments();
  }, [studyId]);

  const refreshTodayFulfillments = useCallback(async () => {
    if (!studyId) return [];
    
    try {
      const todayHabitsResponse = await axiosInstance.get(API_ENDPOINTS.HABITS.GET_TODAY(studyId));
      const todayHabitsResponseData = todayHabitsResponse.data || {};
      
      let habitsData = [];
      if (todayHabitsResponseData.success && Array.isArray(todayHabitsResponseData.data)) {
        habitsData = todayHabitsResponseData.data;
      } else if (Array.isArray(todayHabitsResponseData)) {
        habitsData = todayHabitsResponseData;
      } else if (todayHabitsResponseData.habits && Array.isArray(todayHabitsResponseData.habits)) {
        habitsData = todayHabitsResponseData.habits;
      } else if (todayHabitsResponseData.data && Array.isArray(todayHabitsResponseData.data)) {
        habitsData = todayHabitsResponseData.data;
      }
      
      const fulfillments = habitsData
        .filter(habit => habit.hasFullfillment === true)
        .map(habit => ({
          habit_pk: habit.habit_pk || habit.id || habit.habitId,
          fullfillmentCount: habit.fullfillmentCount || 0
        }));
      
      setTodayFulfillments(fulfillments);
      return fulfillments;
    } catch (error) {
      return [];
    }
  }, [studyId]);

  return {
    loading: loading || studyLoading,
    viewStudyDetailTitle,
    todayFulfillments,
    refreshTodayFulfillments,
  };
};

export default useTodayHabit;

