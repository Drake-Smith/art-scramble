import React from 'react';
import styles from './Grid.scss';
import axios  from 'axios'

import Tile from './../Tile/Tile'
import { API_URL } from '../../config-key.js'
//import * as helpers                    from './../../helpers.js'

class Grid extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      gridHeight: 0,
      gridWidth: 0,
      tiles: []
    }

    // tiles: [
    //   {
    //     currentPos: {
    //       x: 0,
    //       y: 0,
    //     }
    //     actualPos: {
    //       x: 0,
    //       y: 0,
    //     }
    //     url: ''
    //   }
    // ]

  }

  componentDidMount() {
    //retrieve art tiles
    axios.get(API_URL)
      .then((response) => {
        
        //z2 is array of objects filtered down to 1 object in array
        const z2 = response.data.levels.filter((level) => {
          return level.name === 'z2'
        })

        //grab the painting's total height and width
        const gridHeight = z2[0].height;
        const gridWidth = z2[0].width;
      

        // @todo - if i want to track the actual x y current Position myself
        // const tiles = z2[0].tiles.map((tile) => {
        //   tile.actualPosition = {
        //     x: tile.x,
        //     y: tile.y
        //   }
        //   tile.currentPosition = {
        //     x:
        //     y:
        //   }
        // });

        //console.log('this is z2', z2);

        this.setState((prevState) => ({
          gridHeight: gridHeight,
          gridWidth: gridWidth,
          tiles: z2[0].tiles,
        }));
      })
      .catch((err) => {
        console.log('There was an error retrieving the data', err);
      })
  }

  handleSwap(event) {
    alert('clicked!')
  }


  //loop to assign x and y current position
  determineCurrentPosition(Xcur, Xmax, Ycur, Ymax) {
    for (var y = 0; y < Ymax; y++) {
      for (var x = 0; x < Xmax; x++) {
        //var xPos = x * map.tileSize;
        //var yPos = y * map.tileSize;
        console.log('-----------------')
        console.log('X: ' + x)
        console.log('Y: ' + y)
        console.log('-----------------')        
      }
    }
  }
 
  render() {

    //let rows = Math.ceil(this.state.data.levels[0].width / 512);
    //let columns = Math.ceil(this.state.data.levels[0].height / 512);

    if (this.state.tiles.length == 0) {
      return null;
    } else {
        const tiles = this.state.tiles.map((tile) => {
          return <Tile url={tile.url}
             
                  />
                  //onClick={this.handleSwap}
                  // actualPos={actualPos}
                  // currentPos={currentPos}
          });
   
        return <div className={styles.gridContainer}>
                {tiles}
               </div>
    }
  }
}

export default Grid;
