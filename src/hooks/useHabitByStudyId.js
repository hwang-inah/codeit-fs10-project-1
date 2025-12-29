import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import axiosInstance from '../utils/axiosInstance';
import API_ENDPOINTS from '../utils/apiEndpoints';

const parseHabitsData = (habitsResponseData) => {
  if (habitsResponseData.success && Array.isArray(habitsResponseData.data)) {
    return habitsResponseData.data;
  }
  if (Array.isArray(habitsResponseData)) {
    return habitsResponseData;
  }
  if (habitsResponseData.habits && Array.isArray(habitsResponseData.habits)) {
    return habitsResponseData.habits;
  }
  if (habitsResponseData.data && Array.isArray(habitsResponseData.data)) {
    return habitsResponseData.data;
  }
  return [];
};

const transformHabits = (habitsData) => {
  return habitsData.map(habit => ({
    habit_pk: habit.habit_pk || habit.id || habit.habitId,
    id: String(habit.habit_pk || habit.id || habit.habitId),
    name: habit.habit_name || habit.name || habit.habitName || ''
  }));
};

const useHabitByStudyId = (studyId) => {
  const [loading, setLoading] = useState(true);
  const [viewStudyDetailTitle, setViewStudyDetailTitle] = useState('');
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchStudyData = async () => {
      if (!studyId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        const [studyResponse, habitsResponse] = await Promise.all([
          axiosInstance.get(API_ENDPOINTS.STUDIES.GET_BY_ID(studyId), {
            signal: abortController.signal
          }),
          axiosInstance.get(API_ENDPOINTS.HABITS.GET_BY_STUDY(studyId), {
            signal: abortController.signal
          }).catch(err => {
            if (axios.isCancel(err) || err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
              throw err;
            }
            return { data: [] };
          })
        ]);
        
        const responseData = studyResponse.data;
        const studyData = responseData.data || responseData;
        
        setViewStudyDetailTitle(studyData.study_name || '');
        
        const habitsResponseData = habitsResponse.data || {};
        const habitsData = parseHabitsData(habitsResponseData);
        const transformedHabits = transformHabits(habitsData);
        setHabits(transformedHabits);
      } catch (error) {
        if (axios.isCancel(error) || error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
          return;
        }
        setViewStudyDetailTitle('스터디 정보를 불러올 수 없습니다');
        setHabits([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudyData();
    
    return () => {
      abortController.abort();
    };
  }, [studyId]);

  const refreshHabits = useCallback(async () => {
    if (!studyId) return [];
    
    try {
      setLoading(true);
      const habitsResponse = await axiosInstance.get(API_ENDPOINTS.HABITS.GET_BY_STUDY(studyId));
      const habitsResponseData = habitsResponse.data || {};
      const habitsData = parseHabitsData(habitsResponseData);
      const transformedHabits = transformHabits(habitsData);
      setHabits(transformedHabits);
      return transformedHabits;
    } catch (error) {
      return [];
    } finally {
      setLoading(false);
    }
  }, [studyId]);

  return {
    loading,
    viewStudyDetailTitle,
    habits,
    refreshHabits,
  };
};

export default useHabitByStudyId;

