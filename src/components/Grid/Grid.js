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
        
        //identify and filter response object to just zoom level 2 array
        //returns an array with 1 obj inside
        const collection = response.data.levels.filter((level) => {
          return level.name === 'z2'
        })
        
        //create actualPosition key, move the x and y coordinate there
        //returns Array of Objects
        let tileMapping = collection[0].tiles.map((tile) => ({
          actualPosition: {
            x: tile.x,
            y: tile.y
          },
          url: tile.url
        }));

        //grab the painting's total height and width
        const gridHeight = collection[0].height;
        const gridWidth = collection[0].width;
        
        //determine number of rows and columns 
        const rowsX = Math.ceil(gridWidth / 512);
        const columnsY = Math.ceil(gridHeight / 512);

        //console.log('HOW MANY ROWS?', rowsX)
        //console.log('HOW MANY COLUMNS?', columnsY)
        
        //create new array of objects and assign the tile's current x and y position
        //this will later merge with our collection array
        let modifiedTiles = [];
        //add the current position of tile 
        for (var y = 0; y < columnsY; y++) {
          for (var x = 0; x < rowsX; x++) {
            let current = {
              currentPosition: {
                x: x,
                y: y
              }
            }
            modifiedTiles.push(current);      
          }
        }

        //console.log(JSON.stringify(modifiedTiles, null, 4))
        let finalMergedCollection = [];
        for (var i = 0; i < tileMapping.length; i++) {
            let combined = Object.assign(tileMapping[i], modifiedTiles[i])
            finalMergedCollection.push(combined)
        }
        console.log('THE FINAL OBJ')
        console.log(JSON.stringify(finalMergedCollection, null, 4))

        this.setState((prevState) => ({
          gridHeight: gridHeight,
          gridWidth: gridWidth,
          tiles: finalMergedCollection
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

  setGridDimension(height, width) {
    let elem = document.querySelector(styles.gridContainer);
    console.log('This is element', elem)
    elem.height = height;
    elem.width = width;
  }
 
  render() {

    //let rows = Math.ceil(this.state.data.levels[0].width / 512);
    //let columns = Math.ceil(this.state.data.levels[0].height / 512);

    if (this.state.tiles.length == 0) {
      return null;
    } else {
        const gridHeight = this.state.gridHeight / 2;
        const gridWidth = this.state.gridWidth / 2;
        //this.setGridDimension(gridHeight, gridWidth )
        const tiles = this.state.tiles.map((tile) => {
          return <Tile url={tile.url}
                       key={tile.url}
                  />
                  //onClick={this.handleSwap}
                  // actualPos={actualPos}
                  // currentPos={currentPos}
          });
        return <div className={styles.gridContainer} style={{height: gridHeight, width: gridWidth}}>
                {tiles}
               </div>
    }
  }
}

export default Grid;
