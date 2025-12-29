import StudyCard from '../molecule/StudyCard';
import EmptyState from '../UI/EmptyState';
import templateStyles from '../../styles/Template.module.css';
import styles from '../../styles/LandingPage.module.css';

const RecentStudy = ({studies}) => {

  return (
    <section>
      <h2 className={templateStyles.title}>최근 조회한 스터디</h2>

      {studies.length === 0 ? (  
        <EmptyState message="아직 조회한 스토리가 없어요" />
      ) : ( 
        <div className={`${styles.cardList} ${styles.recentList}`}>
          {studies.map((study) => (
            <StudyCard key={study.id} {...study} />
          ))}
        </div>
      )}

    </section>
  );
};

export default RecentStudy;