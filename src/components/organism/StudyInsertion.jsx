import { useMemo } from 'react';
import InputLabel from '../molecule/InputLabel';
import ThumbNailSelect from '../molecule/ThumbNailSelect';
import templateStyles from '../../styles/Template.module.css';
import styles from '../../styles/Input.module.css';
import useStudyCreation from '../../hooks/useStudyCreation';
import Button from '../UI/Button/Button';

const StudyInsertion = () => {
  const {
    formData,
    showPassword,
    errors,
    touched,      
    handleChange,
    handleBlur,    
    togglePassword,
    handleSubmit
  } = useStudyCreation();
  
  const topInputFields = useMemo(() => [
    { 
      label: '닉네임',
      placeholder: '닉네임을 입력해 주세요',
      type: 'text',
      field: 'nickName' ,
      errorMessage: formData.nickName.trim() && formData.nickName.trim().length < 3 
        ? '닉네임은 3글자 이상 입력해주세요' 
        : '닉네임을 입력해주세요'
    },
    { 
      label: '스터디 이름', 
      placeholder: '스터디 이름을 입력해 주세요', 
      type: 'text', 
      field: 'studyName' ,
      errorMessage: formData.studyName.trim() && formData.studyName.trim().length < 5
        ? '스터디 이름은 5글자 이상 입력해주세요'
        : '스터디 이름을 입력해주세요'
    },
    { 
      label: '소개', 
      placeholder: '소개 멘트를 작성해 주세요', 
      type: 'text', 
      field: 'introduction',
      errorMessage: formData.introduction.trim() && formData.introduction.trim().length < 10
        ? '소개는 10글자 이상 입력해주세요'
        : '소개를 입력해주세요'
    },
  ], [formData.nickName, formData.studyName, formData.introduction]);

  return (
    <section>
      <h2 className={templateStyles.title}>스터디 만들기</h2>

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
        
        <ThumbNailSelect 
          selectedThumbNail={formData.thumbNail}
          onSelectThumbNail={(thumbNail) => handleChange('thumbNail', thumbNail)}
        />

        <div>
          <InputLabel
            label="비밀번호"
            type="password"
            placeholder="비밀번호를 입력해 주세요"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            onBlur={() => handleBlur('password')}
            error={touched.password && errors.password}
            errorMessage={
              !formData.password.trim() 
                ? "비밀번호를 입력해주세요"
                : formData.password.length < 8 || !/\d/.test(formData.password)
                ? "비밀번호는 최소 8자리 이상이며, 숫자를 포함해야 합니다"
                : "비밀번호를 입력해주세요"
            }
            showPassword={showPassword.password}
            onTogglePassword={() => togglePassword('password')}
          />

          <InputLabel
            label="비밀번호 확인"
            type="password"
            placeholder="비밀번호를 다시 한 번 입력해 주세요"
            value={formData.passwordConfirm}
            onChange={(e) => handleChange('passwordConfirm', e.target.value)}
            onBlur={() => handleBlur('passwordConfirm')}
            error={touched.passwordConfirm && errors.passwordConfirm}
            errorMessage={
              !formData.passwordConfirm.trim()
                ? "비밀번호를 입력해주세요"
                : formData.passwordConfirm.length < 8 || !/\d/.test(formData.passwordConfirm)
                ? "비밀번호는 최소 8자리 이상이며, 숫자를 포함해야 합니다"
                : formData.password !== formData.passwordConfirm
                ? "비밀번호가 일치하지 않습니다"
                : "비밀번호를 입력해주세요"
            }
            showPassword={showPassword.passwordConfirm}
            onTogglePassword={() => togglePassword('passwordConfirm')}
          />
        </div>

        <div className={styles.buttonBoxForEditForm}>
          <Button type="submit" className={styles.button}>
            만들기
          </Button>
        </div>
      </form>
    </section>
  );
};

export default StudyInsertion;