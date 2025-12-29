import React from 'react';
import Button from '../Button/Button';
import InputText from '../InputText/InputText';
import Label from '../Label/Label';
import icEyeOpen from '/public/assets/images/icons/eye-open.svg';
import icEyeClose from '/public/assets/images/icons/eye-closed.svg';
import { useState } from 'react';
import styles from './PasswordModal.module.css';
import axiosInstance from '../../../utils/axiosInstance';
import API_ENDPOINTS from '../../../utils/apiEndpoints';
import useToast from '../../../hooks/useToast';


const PasswordModal = ({ 
    password, 
    onPasswordChange, 
    onPasswordSubmit, 
    buttonText = '수정하러 가기', 
    buttonIcon,
    modalTitleText = '',
    modalTitleClassName = 'passwordModalTitle',
    modalTitleId = 'passwordModalTitle',
    errorMessageText = '권한이 필요해요!',
    errorMessageClassName = 'passwordModalErrorMessageText',
    errorMessageId = 'passwordModalErrorMessage',
    onPasswordExit,
    onPasswordExitText = '나가기',
    onPasswordExitClassName = 'passwordModalErrorMessageText',
    passwordInputClassName = 'passwordModalErrorMessageText',
    passwordInputId = 'password',
    passwordInputPlaceholder = '비밀번호를 입력해주세요',
    passwordInputType = 'password',
    studyId,
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [showPasswordError, setShowPasswordError] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const { showSuccess, showError } = useToast();
    const actualPasswordInputType = isPasswordVisible ? 'text' : passwordInputType;
    
    const handlePasswordExit = () => {
        setShowPasswordError(false);
        onPasswordExit && onPasswordExit();
    };
    
    const handlePasswordChange = (e) => {
        setShowPasswordError(false);
        onPasswordChange && onPasswordChange(e);
    };
    
    const handlePasswordSubmit = async () => {
        if (!password || password.trim() === '') {
            setShowPasswordError(true);
            return;
        }
        
        if (studyId) {
            try {
                setIsVerifying(true);
                setShowPasswordError(false);
                
                const response = await axiosInstance.post(
                    API_ENDPOINTS.STUDIES.VERIFY_PASSWORD(studyId),
                    { password }
                );
                
                const responseData = response.data;
                const isSuccess = responseData?.success === true || 
                                (response.status >= 200 && response.status < 300 && responseData?.success !== false);
                
                if (isSuccess) {
                    showSuccess('인증되었습니다.');
                    onPasswordSubmit && onPasswordSubmit();
                } else {
                    setShowPasswordError(true);
                    showError('비밀번호가 일치하지 않습니다.');
                }
            } catch (error) {
                const status = error.response?.status;
                const errorData = error.response?.data;
                
                if (status === 401 || status === 403 || errorData?.success === false) {
                    setShowPasswordError(true);
                    showError('비밀번호가 일치하지 않습니다.');
                } else {
                    setShowPasswordError(true);
                    showError('에러가 발생해 실패했습니다.');
                }
            } finally {
                setIsVerifying(false);
            }
        } else {
            setShowPasswordError(false);
            onPasswordSubmit && onPasswordSubmit();
        }
    };
    
    const displayErrorMessage = showPasswordError ? '비밀번호가 필요합니다.' : errorMessageText;
    return (
    <>
        <div className={styles.passwordModalContainer}>
            <div className={styles.passwordModalBox}>
                <div className={styles.passwordModalContent}>
                    <Label 
                        labelText={modalTitleText} 
                        labelClassName={`${styles.passwordModalTitle} ${modalTitleClassName}`} 
                        labelId={modalTitleId}>
                    </Label>
                    <span 
                        className={`${styles.passwordModalExit} ${onPasswordExitClassName}`} 
                        onClick={handlePasswordExit}>{onPasswordExitText}
                    </span>
                </div>
                <div className={styles.passwordModalErrorMessage}>
                    <Label 
                        labelText={displayErrorMessage} 
                        labelClassName={`${styles.passwordModalErrorMessageText} ${showPasswordError ? styles.passwordModalErrorMessageTextError : ''} ${errorMessageClassName}`} 
                        labelId={errorMessageId}>
                    </Label>
                </div>
                <div className={styles.passwordModalInputContainer}>
                    <Label htmlFor="password" labelText="비밀번호" labelClassName={styles.passwordLabel} />
                    <div className={styles.passwordInputWrapper}>
                        <InputText 
                            id={passwordInputId} 
                            value={password} 
                            onChange={handlePasswordChange} 
                            placeholder={passwordInputPlaceholder} 
                            type={actualPasswordInputType} 
                            className={`${styles.passwordInput} ${showPasswordError ? styles.passwordInputError : ''} ${passwordInputClassName}`} 
                        required/>
                        <img 
                            src={isPasswordVisible ? icEyeOpen : icEyeClose} 
                            alt="비밀번호 보기" 
                            className={styles.passwordEyeIcon} 
                            onMouseDown={() => setIsPasswordVisible(true)}
                            onMouseUp={() => setIsPasswordVisible(false)}
                            onMouseLeave={() => setIsPasswordVisible(false)}
                            onTouchStart={() => setIsPasswordVisible(true)}
                            onTouchEnd={() => setIsPasswordVisible(false)}
                        />
                    </div>
                </div>
                <div className={styles.passwordModalButtonContainer}>
                    <Button 
                        className={styles.passwordSubmitBtn} 
                        onClick={handlePasswordSubmit}
                        disabled={isVerifying}>
                        {buttonIcon && <img src={buttonIcon} alt="" className={buttonText ? styles.buttonIconWithText : styles.buttonIcon} />}
                        {isVerifying ? '확인 중...' : buttonText}
                    </Button>
                </div>
            </div>
        </div>
    </>
    );
};

export default PasswordModal;
