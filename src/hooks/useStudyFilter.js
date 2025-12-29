import { useState, useMemo, useCallback } from 'react';

const useStudyFilter = (studies = []) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortOption, setSortOption] = useState('최근 순');
  const [displayCount, setDisplayCount] = useState(6);

  const filteredStudies = useMemo(() => {
    return studies.filter(study => {
      const keyword = searchKeyword.toLowerCase();
      return (
        (study.nickName || '').toLowerCase().includes(keyword) ||
        (study.studyName || '').toLowerCase().includes(keyword) ||
        (study.introduction || '').toLowerCase().includes(keyword)
      );
    });
  }, [studies, searchKeyword]);

  const sortedStudies = useMemo(() => {
    return [...filteredStudies].sort((a, b) => {
      switch (sortOption) {
        case '최근 순':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case '오래된 순':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case '많은 포인트 순':
          return (b.point || 0) - (a.point || 0);
        case '적은 포인트 순':
          return (a.point || 0) - (b.point || 0);
        default:
          return 0;
      }
    });
  }, [filteredStudies, sortOption]);

  const displayedStudies = useMemo(() => sortedStudies.slice(0, displayCount), [sortedStudies, displayCount]);

  const handleLoadMore = useCallback(() => {
    setDisplayCount(prevCount => prevCount + 6);
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchKeyword(e.target.value);
    setDisplayCount(6);
  }, []);

  const handleSortChange = useCallback((e) => {
    setSortOption(e.target.value);
    setDisplayCount(6);
  }, []);

  return {
    searchKeyword,
    sortOption,
    sortedStudies,
    displayedStudies,
    displayCount,
    handleSearchChange,
    handleSortChange,
    handleLoadMore
  };
};

export default useStudyFilter;

