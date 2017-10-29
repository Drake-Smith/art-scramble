import React from 'react';
import styles from './SideInfoPanel.scss';



class SideInfoPanel extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className={styles.panelContainer}>
        <div className={styles.panelContent}>
          <h1 className={styles.paintTitle}>{this.props.info.title}</h1>
          <p className={styles.infoLine}>{this.props.info.painter}</p>
          <p className={styles.infoLine}>{this.props.info.date}</p>
        </div>
        
        <button className={styles.nextPaintingBtn} onClick={this.props.showNextPainting}>
          Next Painting
        </button>

        <div className={styles.winnerBox}>
          {this.props.winner && <h1 className={styles.winnerMsg}>WINNER!</h1>}
        </div>

      </div>
    );
  }
}

export default SideInfoPanel;
