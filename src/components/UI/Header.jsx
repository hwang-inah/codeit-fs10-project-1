import TemplateStyles from '../../styles/Template.module.css'
import styles from '../../styles/Input.module.css'
import logo from '/assets/images/logos/img_logo.svg'
import { Link, useLocation } from 'react-router';

const Header = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
  <header className={TemplateStyles.navbar}>
    <Link to='/'>
      <img src={logo} alt="로고" width="135" />
    </Link>
    <Link to='/enrollment' className={`${styles.button} ${styles.buttonCreateForm}`}>스터디 만들기</Link>
  </header>
  );
};

export default Header;
