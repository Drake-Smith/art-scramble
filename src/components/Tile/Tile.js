import React from 'react';
import styles from './Tile.scss';


class Tile extends React.Component {
  constructor(props) {
    super(props)

  }

  render() {
    const style = {
      'height': this.props.height,
      'width': this.props.width,
      'float': 'left',
      'display': 'inline-block'
    }
    // <div style={style}>
    // </div>
    return (
        <div style={style}>
          <img className={styles.tileImg} src={this.props.url} onClick={this.props.onClick} />  
        </div>
    )
  }
}

export default Tile;
