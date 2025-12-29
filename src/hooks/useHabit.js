import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import API_ENDPOINTS from '../utils/apiEndpoints';

const useHabit = (studyId) => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHabits = async () => {
      if (!studyId) {
        setHabits([]);
        return;
      }

      try {
        setLoading(true);
        
        const habitsResponse = await axiosInstance.get(API_ENDPOINTS.HABITS.GET_WEEK(studyId));
        const habitsResponseData = habitsResponse.data || {};
        
        let habitsData = [];
        if (habitsResponseData.success && Array.isArray(habitsResponseData.data)) {
          habitsData = habitsResponseData.data;
        } else if (Array.isArray(habitsResponseData)) {
          habitsData = habitsResponseData;
        } else if (habitsResponseData.habits && Array.isArray(habitsResponseData.habits)) {
          habitsData = habitsResponseData.habits;
        } else if (habitsResponseData.data && Array.isArray(habitsResponseData.data)) {
          habitsData = habitsResponseData.data;
        }
        
        const transformedHabits = habitsData.map(habit => {
          const completed = [];
          
          if (habit.fullfillmentCountByDay && typeof habit.fullfillmentCountByDay === 'object') {
            Object.keys(habit.fullfillmentCountByDay).forEach(dayKey => {
              const dayIndex = parseInt(dayKey, 10);
              const count = habit.fullfillmentCountByDay[dayKey];
              if (dayIndex >= 0 && dayIndex <= 6 && count > 0 && !completed.includes(dayIndex)) {
                completed.push(dayIndex);
              }
            });
          }
          
          if (completed.length === 0 && habit.weekFullfillments && Array.isArray(habit.weekFullfillments)) {
            habit.weekFullfillments.forEach(fulfillment => {
              if (fulfillment.habit_fullfillment_day !== undefined && fulfillment.habit_fullfillment_day !== null) {
                const dayIndex = parseInt(fulfillment.habit_fullfillment_day, 10);
                if (dayIndex >= 0 && dayIndex <= 6 && !completed.includes(dayIndex)) {
                  completed.push(dayIndex);
                }
              }
            });
          }
          
          return {
            id: String(habit.habit_pk || habit.id || habit.habitId || ''),
            name: habit.habit_name || habit.name || habit.habitName || '',
            completed: completed.sort((a, b) => a - b)
          };
        });
        
        setHabits(transformedHabits);
      } catch (error) {
        setHabits([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();
  }, [studyId]);

  return {
    habits,
    loading,
  };
};

export default useHabit;

