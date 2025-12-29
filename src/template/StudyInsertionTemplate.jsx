import React from 'react';
import { useParams } from 'react-router';
import styles from '../styles/Template.module.css';
import StudyInsertion from '../components/organism/StudyInsertion';
import EditForm from '../components/organism/EditForm';

const StudyInsertionTemplate = () => {
  const { studyId } = useParams();
  
  return (
    <div className={`${styles.wrapper} ${styles.StudyInsertionWrapper}`}>
      <div className={styles.container}>
        {studyId ? <EditForm /> : <StudyInsertion />}
      </div>
    </div>
  );
};

export default StudyInsertionTemplate;