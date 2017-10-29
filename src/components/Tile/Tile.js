import React from 'react';
import styles from './Tile.scss';


class Tile extends React.Component {
  constructor(props) {
    super(props)

    this.handleImgResize = this.handleImgResize.bind(this)
  }

  handleImgResize() {      
  }
  //<div style={{'float': 'left', 'display': 'inlineBlock'}}>
  //    </div>
  render() {
    return (
      <img className={styles.tileImg} src={this.props.url} onClick={this.props.onClick} onLoad={this.handleImgResize}
      />
    )
  }
}

export default Tile;
