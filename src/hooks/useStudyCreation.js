import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import API_ENDPOINTS from '../utils/apiEndpoints';
import useToast from './useToast';


const useStudyCreation = () => {
  const navigate = useNavigate();
  const { showSuccess, showError, showInfo } = useToast();

  const [formData, setFormData] = useState({
    nickName: '',
    studyName: '',
    introduction: '',
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

  const validatePassword = useCallback((password) => {
    if (!password) return false;
    if (password.length < 8) return false;
    if (!/\d/.test(password)) return false;
    return true;
  }, []);

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

      if (field === 'password' || field === 'passwordConfirm') {
        if (!validatePassword(value)) {
          setErrors(prevErrors => ({ ...prevErrors, [field]: true }));
          return prev;
        }
      }

      if (field === 'passwordConfirm' && value !== prev.password) {
        setErrors(prevErrors => ({ ...prevErrors, passwordConfirm: true }));
        return prev;
      }

      setErrors(prevErrors => ({ ...prevErrors, [field]: false }));
      return prev;
    });
  }, [validatePassword]);

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

    if (!validatePassword(formData.password)) {
      newErrors.password = true;
      hasError = true;
    }

    if (!validatePassword(formData.passwordConfirm)) {
      newErrors.passwordConfirm = true;
      hasError = true;
    }

    if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = true;
      hasError = true;
    }

    setTouched(newTouched);
    setErrors(newErrors);

    if (hasError) {
      return;
    }

    showInfo('생성 중');
    
    try {
      const backgroundNumber = formData.thumbNail.replace('thumbnail', '');
      const background = parseInt(backgroundNumber, 10);

      const submitData = {
        nickname: formData.nickName,
        study_name: formData.studyName,
        study_introduction: formData.introduction,
        password: formData.password,
        background: background
      };
      
      await axiosInstance.post(
        API_ENDPOINTS.STUDIES.CREATE,
        submitData
      );
      
      showSuccess('스터디 생성에 성공했습니다.');
      navigate('/');
      
    } catch (error) {
      showError('스터디 생성에 실패했습니다.');
    }
  }, [formData, validatePassword, showInfo, showSuccess, showError, navigate]);

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

export default useStudyCreation;

