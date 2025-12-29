import styles from '../../styles/Input.module.css';
import eyes from '/assets/images/icon/eyes1.svg'
import showEyes from '/assets/images/icon/eyes2.svg'


const InputLabel = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  errorMessage,
  showPassword,
  onTogglePassword
}) => {
  const introInput = label === "소개";
  
  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      
      {introInput ? (
        <textarea 
          className={`${styles.input} ${styles.inputLabel} ${styles.introInput}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        /> 
      ) : type === 'password' ? (
        <div className={`${styles.input} ${styles.inputLabel} ${styles.passwordWrapper} ${error ? styles.inputError : ''}`}>
          <input 
            className={styles.passwordBox}
            type={showPassword ? 'text' : 'password'}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
          />
          <button type='button' onClick={onTogglePassword} className={styles.eyesButton}>
            <img
              src={showPassword ? showEyes : eyes}
              alt={showPassword ? '비밀번호 보기' : '비밀번호 숨기기'}
            />
          </button>
        </div>
      ) : (
        <input 
          className={`${styles.input} ${styles.inputLabel} ${error ? styles.inputError : ''}`}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}

      {error && (
        <p className={styles.errorMessage}>*{errorMessage}</p>
      )}
    </div>
  );
}

export default InputLabel;