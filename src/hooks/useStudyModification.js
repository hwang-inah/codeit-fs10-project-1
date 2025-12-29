import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import API_ENDPOINTS from '../utils/apiEndpoints';


const DEFAULT_INTRODUCTION = '입력된 소개 멘트가 없습니다.';

const useStudyModification = (studyId) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nickName: '',
    studyName: '',
    introduction: DEFAULT_INTRODUCTION,
    thumbNail: 'thumbnail0',
  });

  const [errors, setErrors] = useState({});
  const [touched,     setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (studyId) {
      const fetchStudyData = async () => {
        try {
          const response = await axiosInstance.get(API_ENDPOINTS.STUDIES.GET_BY_ID(studyId));
          const responseData = response.data;
          const studyData = responseData.data || responseData;
          setFormData({
            nickName: studyData.nickname || '',
            studyName: studyData.study_name || '',
            introduction: studyData.study_introduction || DEFAULT_INTRODUCTION,
            thumbNail: studyData.background !== undefined ? `thumbnail${studyData.background}` : 'thumbnail0',
          });
        } catch (error) {
        }
      };
      fetchStudyData();
    }
  }, [studyId]);

  const handleChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleBlur = useCallback((field) => {
    setTouched(prev => ({ ...prev, [field]: true }));

    setFormData(prev => {
      const value = prev[field]?.trim?.() ?? '';

      if (!value) {
        setErrors(prevErrors => ({ ...prevErrors, [field]: true }));
        return prev;
      }

      // Validation rules
      if (field === 'nickName' && value.length < 3) {
        setErrors(prevErrors => ({ ...prevErrors, [field]: true }));
        return prev;
      }

      if (field === 'studyName' && value.length < 5) {
        setErrors(prevErrors => ({ ...prevErrors, [field]: true }));
        return prev;
      }

      if (field === 'introduction' && value.length < 10) {
        setErrors(prevErrors => ({ ...prevErrors, [field]: true }));
        return prev;
      }

      setErrors(prevErrors => ({ ...prevErrors, [field]: false }));
      return prev;
    });
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    const requiredFields = ['nickName', 'studyName'];

    let hasError = false;
    const newErrors = {};
    const newTouched = {};

    requiredFields.forEach(field => {
      newTouched[field] = true;

      if (!formData[field].trim()) {
        newErrors[field] = true;
        hasError = true;
      }
    });

    // Validation rules
    if (formData.nickName.trim() && formData.nickName.trim().length < 3) {
      newErrors.nickName = true;
      hasError = true;
    }

    if (formData.studyName.trim() && formData.studyName.trim().length < 5) {
      newErrors.studyName = true;
      hasError = true;
    }

    if (formData.introduction.trim() && formData.introduction.trim().length < 10) {
      newErrors.introduction = true;
      hasError = true;
    }

    setTouched(newTouched);
    setErrors(newErrors);

    if (hasError) {
      return;
    }

    setIsSubmitting(true);
    try {
      const backgroundNumber = formData.thumbNail.replace('thumbnail', '');
      const background = parseInt(backgroundNumber, 10);
      
      const submitData = {
        nickname: formData.nickName,
        study_name: formData.studyName,
        study_introduction: formData.introduction || '',
        background: background
      };
      
      await axiosInstance.put(
        API_ENDPOINTS.STUDIES.UPDATE(studyId),
        submitData
      );
      
      navigate(`/detail/${studyId}`);
      
    } catch (error) {
      alert('스터디 수정에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, studyId, navigate]);

  return {
    formData,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit
  };
};

export default useStudyModification;

