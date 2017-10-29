import React  from 'react';
import styles from './Tile.scss';

const Tile = (props) => {

  //additional styling
  //set height and width from props
  const styleObj = {
    height: props.height,
    width: props.width,
  }

  return (
    <div className={styles.imgContainer} style={styleObj}>
      <img className={styles.tileImg} src={props.url} onClick={props.onClick} alt={'Painting'} />  
    </div>
  )
}

export default Tile;
