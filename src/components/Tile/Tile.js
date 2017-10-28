import React from 'react';
import styles from './Tile.scss';

const Tile = (props) => {
  return (
    <div style={{'float': 'left', 'display': 'inlineBlock'}}>
      <img style={{'margin': '5px'}} src={props.url} onClick={props.onClick} />
    </div>
  )
};

export default Tile;
