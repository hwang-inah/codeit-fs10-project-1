import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import API_ENDPOINTS from '../utils/apiEndpoints';


const DEFAULT_INTRODUCTION = '새로운 스터디에 오신 것을 환영합니다!';

const useStudyUpdate = ( studyId ) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nickName: '',
    studyName: '',
    introduction: DEFAULT_INTRODUCTION,
    thumbNail: 'thumbnail0',
    password: '',
    passwordConfirm: ''
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    passwordConfirm: false
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleBlur = useCallback((field) => {
    setTouched(prev => ({ ...prev, [field]: true }));

    setFormData(prev => {
      const value = prev[field]?.trim?.() || '';

      if (!value) {
        setErrors(prevErrors => ({ ...prevErrors, [field]: true }));
        return prev;
      }

      if (field === 'passwordConfirm' && value !== prev.password) {
        setErrors(prevErrors => ({ ...prevErrors, passwordConfirm: true }));
        return prev;
      }

      setErrors(prevErrors => ({ ...prevErrors, [field]: false }));
      return prev;
    });
  }, []);

  const togglePassword = useCallback((field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    const requiredFields = ['nickName', 'studyName', 'password', 'passwordConfirm'];

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

    if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = true;
      hasError = true;
    }

    setTouched(newTouched);
    setErrors(newErrors);

    if (hasError) {
      return;
    }

    try {
      const { passwordConfirm, ...submitData } = formData;
      
      const response = await axiosInstance.put(
        API_ENDPOINTS.STUDIES.UPDATE(studyId),
        submitData
      );
      
      console.log('useStudyUpdate: study update successful:', response.data);
      navigate(`/detail/${studyId}`);
      
    } catch (error) {
      console.error('useStudyUpdate: study update failed:', error);
      console.error('useStudyUpdate: error details:', error.response?.data || error.message);
      alert('useStudyUpdate: study update failed. Please try again.');
    }
  }, [formData, studyId, navigate]);

  return {
    formData,
    showPassword,
    errors,
    touched,
    handleChange,
    handleBlur,
    togglePassword,
    handleSubmit
  };
};
export default useStudyUpdate;

