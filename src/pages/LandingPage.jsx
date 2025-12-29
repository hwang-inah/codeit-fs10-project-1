import { useState, useMemo, useEffect, useRef } from 'react';
import LandingTemplate from '../template/LandingTemplate';
import useGetRequestHandler from '../hooks/useGetRequestHandler';
import API_ENDPOINTS from '../utils/apiEndpoints';
import { getRecentStudyQueue } from '../utils/recentStudyQueue';
import axiosInstance from '../utils/axiosInstance';
import LoadingSpinner from '../components/UI/LoadingSpinner/LoadingSpinner';

const LandingPage = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [debouncedSearchKeyword, setDebouncedSearchKeyword] = useState('');
  const [sortOption, setSortOption] = useState('최근 순');
  const [page, setPage] = useState(1);
  const [accumulatedStudies, setAccumulatedStudies] = useState([]);
  const [recentStudies, setRecentStudies] = useState([]);
  const [recentStudiesLoading, setRecentStudiesLoading] = useState(false);
  const shouldClearSearchRef = useRef(false);
  const limit = 6;
  const prevSearchRef = useRef('');
  const prevSortRef = useRef('최근 순');

  const getSortValue = (option) => {
    const sortMap = {
      '최근 순': 'recent',
      '오래된 순': 'oldest',
      '많은 포인트 순': 'points_desc',
      '적은 포인트 순': 'points_asc'
    };
    return sortMap[option] || 'recent';
  };

  const buildApiUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    params.append('sort', getSortValue(sortOption));
    
    if (debouncedSearchKeyword.trim()) {
      params.append('search', debouncedSearchKeyword.trim());
    }

    return `${API_ENDPOINTS.STUDIES.GET_ALL}?${params.toString()}`;
  }, [page, sortOption, debouncedSearchKeyword]);

  const { data, loading, error, refetch } = useGetRequestHandler(buildApiUrl, {
    enabled: true,
    dependencies: [page, sortOption, debouncedSearchKeyword],
  });

  const transformStudies = (apiData) => {
    if (!apiData?.data?.studies) {
      return [];
    }

    return apiData.data.studies.map((study) => ({
      id: study.study_id,
      studyName: study.study_name,
      introduction: study.study_introduction,
      point: study.point_sum,
      thumbNail: study.background,
      createdAt: study.createdAt,
      nickName: '',
      stats: []
    }));
  };

  const transformRecentStudies = (apiData) => {
    if (!apiData?.data || !Array.isArray(apiData.data)) {
      return [];
    }

    return apiData.data.map((study) => ({
      id: study.study_id,
      studyName: study.study_name,
      introduction: study.study_introduction,
      point: study.point_sum,
      thumbNail: study.background,
      createdAt: study.createdAt,
      nickName: study.nickname || '',
      stats: []
    }));
  };

  useEffect(() => {
    const searchChanged = prevSearchRef.current !== debouncedSearchKeyword;
    const sortChanged = prevSortRef.current !== sortOption;
    
    if (searchChanged || sortChanged) {
      setAccumulatedStudies([]);
      setPage(1);
      prevSearchRef.current = debouncedSearchKeyword;
      prevSortRef.current = sortOption;
    }
  }, [debouncedSearchKeyword, sortOption]);

  useEffect(() => {
    if (data?.data?.studies && data?.data?.pagination) {
      const responsePage = data.data.pagination.page;
      const transformed = transformStudies(data);
      
      if (responsePage === page) {
        if (page === 1) {
          setAccumulatedStudies(transformed);
        } else {
          setAccumulatedStudies(prev => {
            const existingIds = new Set(prev.map(study => study.id));
            const newStudies = transformed.filter(study => !existingIds.has(study.id));
            return [...prev, ...newStudies];
          });
        }

        if (shouldClearSearchRef.current && !loading) {
          setSearchKeyword('');
          shouldClearSearchRef.current = false;
        }
      }
    }
  }, [data, page, loading]);

  const fetchRecentStudies = async () => {
    const studyIds = getRecentStudyQueue();
    
    if (studyIds.length === 0) {
      setRecentStudies([]);
      return;
    }

    setRecentStudiesLoading(true);
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.STUDIES.BATCH, {
        study_ids: studyIds
      });
      
      const transformed = transformRecentStudies(response.data);
      setRecentStudies(transformed);
    } catch (error) {
      setRecentStudies([]);
    } finally {
      setRecentStudiesLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentStudies();
    // Landing page로 돌아올 때 session storage의 studyId 삭제
    sessionStorage.removeItem('current_study_id');
  }, []);

  useEffect(() => {
    const handleRecentStudyUpdate = () => {
      fetchRecentStudies();
    };

    window.addEventListener('recentStudyUpdated', handleRecentStudyUpdate);

    return () => {
      window.removeEventListener('recentStudyUpdated', handleRecentStudyUpdate);
    };
  }, []);

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      setDebouncedSearchKeyword(searchKeyword);
      shouldClearSearchRef.current = true;
    }
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  if (loading && !data) {
    return <LoadingSpinner />;
  }

  if (error) {
    return null;
  }

  const studies = accumulatedStudies;
  const hasMore = data?.data?.pagination 
    ? page < data.data.pagination.totalPages 
    : false;

  return (
    <LandingTemplate 
      studies={studies}
      recentStudies={recentStudies}
      searchKeyword={searchKeyword}
      sortOption={sortOption}
      onSearchChange={handleSearchChange}
      onSearchKeyDown={handleSearchKeyDown}
      onSortChange={handleSortChange}
      onLoadMore={handleLoadMore}
      hasMore={hasMore}
      loading={loading}
    />
  );
};

export default LandingPage;