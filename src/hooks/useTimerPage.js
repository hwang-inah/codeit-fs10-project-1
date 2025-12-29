import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';
import API_ENDPOINTS from '../utils/apiEndpoints';

const useTimerPage = (studyId) => {
  const [studyName, setStudyName] = useState('');
  const [pointSum, setPointSum] = useState(0);
  const [concentrationTime, setConcentrationTime] = useState('00:25:00');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudyData = async () => {
      if (!studyId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axiosInstance.get(API_ENDPOINTS.STUDIES.GET_BY_ID(studyId));
        const responseData = response.data;
        const studyData = responseData.data || responseData;

        setStudyName(studyData.study_name || '');
        setPointSum(studyData.point_sum || 0);
        setConcentrationTime(studyData.concentration_time || '00:25:00');
      } catch (error) {
        console.error('Failed to fetch study data:', error);
        setStudyName('');
        setPointSum(0);
        setConcentrationTime('00:25:00');
      } finally {
        setLoading(false);
      }
    };

    fetchStudyData();
  }, [studyId]);

  const updateConcentrationTime = useCallback(async (newTime) => {
    if (!studyId) {
      return false;
    }

    try {
      await axiosInstance.put(API_ENDPOINTS.STUDIES.UPDATE_CONCENTRATION_TIME(studyId), {
        concentration_time: newTime
      });
      setConcentrationTime(newTime);
      return true;
    } catch (error) {
      console.error('Failed to update concentration time:', error);
      return false;
    }
  }, [studyId]);

  const addPoints = useCallback(async (minutes, contentOverride) => {
    if (!studyId) {
      return false;
    }

    const points = minutes * 2;
    const content = contentOverride || `${minutes}분의 집중 완료!`;

    try {
      await axiosInstance.post(API_ENDPOINTS.POINTS.CREATE(studyId), {
        point_content: content,
        point: points
      });
      
      setPointSum(prev => prev + points);
      return true;
    } catch (error) {
      console.error('Failed to add points:', error);
      return false;
    }
  }, [studyId]);

  const parseTimeToSeconds = useCallback((timeString) => {
    const parts = timeString.split(':');
    if (parts.length === 3) {
      const hours = parseInt(parts[0], 10) || 0;
      const minutes = parseInt(parts[1], 10) || 0;
      const seconds = parseInt(parts[2], 10) || 0;
      return hours * 3600 + minutes * 60 + seconds;
    }
    return 25 * 60; // 기본값 25분
  }, []);

  return {
    studyName,
    pointSum,
    concentrationTime,
    loading,
    updateConcentrationTime,
    addPoints,
    parseTimeToSeconds
  };
};

export default useTimerPage;

