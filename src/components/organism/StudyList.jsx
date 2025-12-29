import StudyCard from '../molecule/StudyCard';
import EmptyState from '../UI/EmptyState';
import LoadingSpinner from '../UI/LoadingSpinner/LoadingSpinner';
import templateStyles from '../../styles/Template.module.css';
import styles from '../../styles/LandingPage.module.css';
import InputSearch from '../atom/InputSearch';
import SortButton from '../atom/SortButton';
import LoadMoreButton from '../atom/LoadMoreButton';

const StudyList = ({ 
  studies = [],
  searchKeyword = '',
  sortOption = '최근 순',
  onSearchChange,
  onSearchKeyDown,
  onSortChange,
  onLoadMore,
  hasMore = false,
  loading = false
}) => {
  const hasNoResults = studies.length === 0 && !loading;
  const hasSearchKeyword = searchKeyword.trim().length > 0;

  return (
    <section>
      <h2 className={templateStyles.title}>스터디 둘러보기</h2>

      <div className={styles.inputBox}>
        <InputSearch 
          value={searchKeyword}
          onChange={onSearchChange}
          onKeyDown={onSearchKeyDown}
        />
        <SortButton 
          value={sortOption}
          onChange={onSortChange}
        />
      </div>

      {hasNoResults ? (
        <EmptyState message={hasSearchKeyword ? "검색 결과가 없습니다" : "아직 둘러 볼 스터디가 없어요"} />
      ) : (  
        <>
          <div className={`${styles.cardList} ${styles.list}`}>
            {studies.map((study) => (
              <StudyCard key={study.id} {...study} />
            ))}
          </div>

          {hasMore && !loading && (
            <div className={styles.buttonBox}>
              <LoadMoreButton onClick={onLoadMore} />
            </div>
          )}

          {loading && studies.length > 0 && (
            <div className={styles.buttonBox}>
              <LoadingSpinner size={30} />
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default StudyList;