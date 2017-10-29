import React  from 'react';
import styles from './SideInfoPanel.scss';

//displays painting info
const SideInfoPanel = (props) => {
  return (
    <div className={styles.panelContainer}>
      <div className={styles.panelContent}>
        <h1 className={styles.paintTitle}>{props.info.title}</h1>
        <p className={styles.infoLine}>{props.info.painter}</p>
        <p className={styles.infoLine}>{props.info.date}</p>
      </div>
      
      <button className={styles.nextPaintingBtn} onClick={props.showNextPainting}>
        Next Painting
      </button>

      <div className={styles.winnerBox}>
        { props.winner && 
          <h1 className={styles.winnerMsg}>WINNER!</h1>
        }
      </div>
    </div>
  );
}

export default SideInfoPanel;
