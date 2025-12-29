import styles from "../../styles/StudyCard.module.css"

export const images = {
  0: "/assets/images/frame/frame00.png",
  1: "/assets/images/frame/frame01.png",
  2: "/assets/images/frame/frame02.png",
  3: "/assets/images/frame/frame03.png",
  4: "/assets/images/frame/frame04.png",
  5: "/assets/images/frame/frame05.png",
  6: "/assets/images/frame/frame06.png",
  7: "/assets/images/frame/frame07.png",
}
const ThumbNail = ({ value = 0, children }) => {

  return (
    <div
      className={styles.thumbNail}
      style={{ 
        backgroundImage: `url(${images[value]})`,
      }}
    >
      {children}
    </div>
  )
}
export default ThumbNail; 