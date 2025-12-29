import { memo } from 'react';
import styles from '../styles/Template.module.css';
import RecentStudy from '../components/organism/RecentStudy';
import StudyList from '../components/organism/StudyList';

const LandingTemplate = memo(({ 
  studies = [],
  recentStudies = [],
  searchKeyword = '',
  sortOption = '최근 순',
  onSearchChange,
  onSearchKeyDown,
  onSortChange,
  onLoadMore,
  hasMore = false,
  loading = false
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <RecentStudy studies={recentStudies} />
      </div>
      <div className={styles.container}>
        <StudyList 
          studies={studies}
          searchKeyword={searchKeyword}
          sortOption={sortOption}
          onSearchChange={onSearchChange}
          onSearchKeyDown={onSearchKeyDown}
          onSortChange={onSortChange}
          onLoadMore={onLoadMore}
          hasMore={hasMore}
          loading={loading}
        />
      </div>
    </div>
  );
});

LandingTemplate.displayName = 'LandingTemplate';

export default LandingTemplate;