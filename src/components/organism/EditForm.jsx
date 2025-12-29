import React from 'react';
import InputLabel from '../molecule/InputLabel';
import ThumbNailSelect from '../molecule/ThumbNailSelect';
import templateStyles from '../../styles/Template.module.css';
import styles from '../../styles/Input.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import useStudyModification from '../../hooks/useStudyModification';
import Button from '../UI/Button/Button';
import LoadingSpinner from '../UI/LoadingSpinner/LoadingSpinner';

const EditForm = () => {
  const navigate = useNavigate();
  const { studyId } = useParams();

  const {
    formData,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,    
    handleSubmit
  } = useStudyModification(studyId);

  const topInputFields = [
    { 
      label: '닉네임',
      placeholder: '닉네임을 수정해 주세요',
      type: 'text',
      field: 'nickName',
      errorMessage: formData.nickName.trim() && formData.nickName.trim().length < 3
        ? '닉네임은 3글자 이상 입력해주세요'
        : '닉네임을 수정해주세요'
    },
    { 
      label: '스터디 이름', 
      placeholder: '스터디 이름을 수정해 주세요', 
      type: 'text',
      field: 'studyName',
      errorMessage: formData.studyName.trim() && formData.studyName.trim().length < 5
        ? '스터디 이름은 5글자 이상 입력해주세요'
        : '스터디 이름을 수정해주세요'
    },
    { 
      label: '소개', 
      placeholder: '소개 멘트를 수정해 주세요', 
      type: 'text',
      field: 'introduction',
      errorMessage: formData.introduction.trim() && formData.introduction.trim().length < 10
        ? '소개는 10글자 이상 입력해주세요'
        : '소개를 수정해주세요'
    },
  ]

  return (
    <section>
      <h2 className={templateStyles.title}>스터디 수정하기</h2>

      <form onSubmit={handleSubmit}>
        <div>
          {topInputFields.map((field, index) => (
            <InputLabel
              key={index}
              label={field.label}
              type={field.type}
              placeholder={field.placeholder}
              value={formData[field.field]}
              onChange={(e) => handleChange(field.field, e.target.value)}
              onBlur={() => handleBlur(field.field)}
              error={touched[field.field] && errors[field.field]}
              errorMessage={field.errorMessage}
            />
          ))}
        </div>

        <div style={{ marginTop: '16px' }}>
          <ThumbNailSelect 
            selectedThumbNail={formData.thumbNail}
            onSelectThumbNail={(thumbNail) => handleChange('thumbNail', thumbNail)}
          />
        </div>

        <div className={styles.buttonBoxForEditForm}>
          <Button 
            type="button" 
            className={styles.button} 
            onClick={() => navigate(`/detail/${studyId}`)}
            disabled={isSubmitting}
          >
            취소  
          </Button>
          <Button type="submit" className={styles.button} disabled={isSubmitting}>
            {isSubmitting ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LoadingSpinner size={16} color="#fff" />
              </div>
            ) : (
              '수정완료'
            )}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default EditForm;