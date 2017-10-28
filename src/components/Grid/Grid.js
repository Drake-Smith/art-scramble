import React from 'react';
import logo from '../../logo.svg';
import styles from './Grid.scss';
import axios  from 'axios'

import { API_KEY, API_URL } from '../../config-key.js'

class Grid extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      data: {
        levels: [
          {
            tiles: []
          }
        ]
      }
    }
  }

  componentDidMount() {
    //retrieve art tiles
    axios.get(API_URL)
      .then((response) => {
        //console.log(JSON.stringify(response.data, null, 4));
        this.setState((prevState) => ({
          data: response.data
        }));
      })
      .catch((err) => {
        console.log('There was an error retrieving the data', err);
      })
  }

  render() {
    //console.log(JSON.stringify(this.state.data.levels, null, 4));
    //console.log(Array.isArray(this.state.data.levels[0]))

    const tiles = this.state.data.levels[0].tiles.map((tile) => {
      return <img style={{'margin': '5px'}} src={tile.url} />
    });
    //console.log(tiles)
    return (
      <div className={styles.gridContainer}>{tiles}</div>
    );
  }
}

export default Grid;
