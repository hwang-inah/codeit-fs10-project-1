import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from '../utils/axiosInstance';
import API_ENDPOINTS from '../utils/apiEndpoints';
import useHabit from './useHabit';

const parseEmojisData = (emojisResponseData) => {
  if (emojisResponseData.success && Array.isArray(emojisResponseData.data)) {
    return emojisResponseData.data;
  }
  if (Array.isArray(emojisResponseData)) {
    return emojisResponseData;
  }
  if (emojisResponseData.emojis && Array.isArray(emojisResponseData.emojis)) {
    return emojisResponseData.emojis;
  }
  if (emojisResponseData.data && Array.isArray(emojisResponseData.data)) {
    return emojisResponseData.data;
  }
  return [];
};

const transformEmojis = (emojisData) => {
  return emojisData.map(emoji => ({
    emojiId: emoji.emoji_id,
    emoji: emoji.emoji_name || emoji.emoji || emoji.icon || '',
    count: emoji.emoji_hit || emoji.count || emoji.value || 0
  })).sort((a, b) => b.count - a.count);
};

const useStudyView = (studyId) => {
  const navigate = useNavigate();
  const { habits } = useHabit(studyId);
  const [viewStudyDetailTitle, setViewStudyDetailTitle] = useState('');
  const [studyIntroduction, setStudyIntroduction] = useState('');
  const [points, setPoints] = useState(0);
  const [emojiMetrics, setEmojiMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shouldWrap, setShouldWrap] = useState(false);
  const [showDeleteStudyModal, setShowDeleteStudyModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [showEditStudyModal, setShowEditStudyModal] = useState(false);
  const [editPassword, setEditPassword] = useState('');
  const [studyPassword, setStudyPassword] = useState('');

  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchStudyData = async () => {
      if (!studyId) {
        return;
      }
      
      try {
        setLoading(true);
        
        const [studyResponse, emojisResponse] = await Promise.all([
          axiosInstance.get(API_ENDPOINTS.STUDIES.GET_BY_ID(studyId), {
            signal: abortController.signal
          }),
          axiosInstance.get(API_ENDPOINTS.EMOJIS.GET_BY_STUDY(studyId), {
            signal: abortController.signal
          })
        ]);
        
        const responseData = studyResponse.data;
        const studyData = responseData.data || responseData;
        
        setViewStudyDetailTitle(studyData.study_name || '');
        setStudyIntroduction(studyData.study_introduction || '');
        setPoints(studyData.point_sum || 0);
        if (studyData.password) {
          setStudyPassword(studyData.password);
        }

        const emojisResponseData = emojisResponse.data || {};
        const emojisData = parseEmojisData(emojisResponseData);
        const sortedEmojis = transformEmojis(emojisData);
        setEmojiMetrics(sortedEmojis);

      } catch (error) {
        if (axios.isCancel(error) || error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
          return;
        }
        setViewStudyDetailTitle('Study name is not available');
        setStudyIntroduction('');
        setPoints(0);
        setEmojiMetrics([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudyData();
    
    return () => {
      abortController.abort();
    };
  }, [studyId]);

  useEffect(() => {
    setShouldWrap(emojiMetrics.length >= 4);
  }, [emojiMetrics]);

  const lastClickTimeRef = useRef({});

  const handleEmojiClick = useCallback(async (emojiId) => {
    const now = Date.now();
    const lastClick = lastClickTimeRef.current[emojiId] || 0;
    
    if (now - lastClick < 1000) {
      return;
    }
    
    lastClickTimeRef.current[emojiId] = now;
    
    let previousMetrics = [];
    setEmojiMetrics(prevMetrics => {
      previousMetrics = [...prevMetrics];
      const updated = prevMetrics.map(item => {
        if (item.emojiId === emojiId) {
          return {
            ...item,
            count: item.count + 1
          };
        }
        return item;
      });
      
      return updated.sort((a, b) => b.count - a.count);
    });
    
    try {
      await axiosInstance.post(API_ENDPOINTS.EMOJIS.INCREMENT(emojiId));
    } catch (error) {
      setEmojiMetrics(previousMetrics);
      lastClickTimeRef.current[emojiId] = 0;
    }
  }, [studyId]);

  const handleEmojiSelect = useCallback(async (emoji) => {
    if (!studyId) {
      return;
    }

    try {
      const emojisResponse = await axiosInstance.get(API_ENDPOINTS.EMOJIS.GET_BY_STUDY(studyId));
      const emojisResponseData = emojisResponse.data || {};
      const emojisData = parseEmojisData(emojisResponseData);
      
      const existingEmoji = emojisData.find(item => 
        (item.emoji_name || item.emoji || item.icon || '') === emoji
      );
      
      if (existingEmoji) {
        await handleEmojiClick(existingEmoji.emoji_id);
        return;
      }

      const newEmoji = {
        emojiId: null,
        emoji: emoji,
        count: 1
      };
      
      let previousMetrics = [];
      setEmojiMetrics(prevMetrics => {
        previousMetrics = [...prevMetrics];
        const updated = [...prevMetrics, newEmoji];
        return updated.sort((a, b) => b.count - a.count);
      });

      const response = await axiosInstance.post(API_ENDPOINTS.EMOJIS.CREATE, {
        study_id: parseInt(studyId, 10),
        emoji_name: emoji,
        emoji_hit: 1
      });
      
      const updatedEmojisResponse = await axiosInstance.get(API_ENDPOINTS.EMOJIS.GET_BY_STUDY(studyId));
      const updatedEmojisResponseData = updatedEmojisResponse.data || {};
      const updatedEmojisData = parseEmojisData(updatedEmojisResponseData);
      const sortedEmojis = transformEmojis(updatedEmojisData);
      setEmojiMetrics(sortedEmojis);
      
    } catch (error) {
      if (error.response?.status === 400 || error.response?.status === 409) {
        try {
          const emojisResponse = await axiosInstance.get(API_ENDPOINTS.EMOJIS.GET_BY_STUDY(studyId));
          const emojisResponseData = emojisResponse.data || {};
          const emojisData = parseEmojisData(emojisResponseData);
          
          const existingEmoji = emojisData.find(item => 
            (item.emoji_name || item.emoji || item.icon || '') === emoji
          );
          
          if (existingEmoji) {
            await handleEmojiClick(existingEmoji.emoji_id);
            return;
          }
        } catch (fetchError) {
        }
      }
      
      setEmojiMetrics(previousMetrics);
    }
  }, [studyId, handleEmojiClick]);

  const handleDeleteStudy = useCallback(async () => {
    if (!studyId) {
      alert('스터디 ID가 없습니다.');
      return;
    }

    if (!deletePassword) {
      alert('비밀번호를 입력해주세요.');
      return;
    }

    if (studyPassword && deletePassword !== studyPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      setDeletePassword('');
      return;
    }

    try {
      await axiosInstance.delete(
        API_ENDPOINTS.STUDIES.DELETE(studyId),
        {
          data: {
            password: deletePassword
          }
        }
      );
      
      alert('스터디가 삭제되었습니다.');
      setShowDeleteStudyModal(false);
      setDeletePassword('');
      navigate('/');
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert('비밀번호가 일치하지 않습니다.');
        setDeletePassword('');
      } else {
        alert('스터디 삭제에 실패했습니다. 다시 시도해주세요.');
      }
    }
  }, [studyId, deletePassword, studyPassword, navigate]);

  const handleEditStudy = useCallback(() => {
    navigate(`/enrollment/${studyId}`);
  }, [studyId, navigate]);

  return {
    viewStudyDetailTitle,
    studyIntroduction,
    habits,
    points,
    emojiMetrics,
    loading,
    shouldWrap,
    showDeleteStudyModal,
    setShowDeleteStudyModal,
    deletePassword,
    setDeletePassword,
    showEditStudyModal,
    setShowEditStudyModal,
    editPassword,
    setEditPassword,
    handleEmojiSelect,
    handleEmojiClick,
    handleDeleteStudy,
    handleEditStudy,
  };
};

export default useStudyView;

