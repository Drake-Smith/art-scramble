import React from 'react';
import styles from './Grid.scss';
import axios  from 'axios'

import Tile from './../Tile/Tile'
import { API_URL } from '../../config-key.js'
import * as helpers                    from './../../helpers.js'

class Grid extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      gridHeight: 0,
      gridWidth: 0,
      rows: 0,
      columns: 0,
      selectedTiles: [],
      tiles: []
    }

    this.checkBoardTiles = this.checkBoardTiles.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.swapTiles = this.swapTiles.bind(this);
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

        // this.setState((prevState) => ({
        //   gridHeight: gridHeight,
        //   gridWidth: gridWidth,
        //   rows: rowsX,
        //   columns: columnsY,
        //   tiles: finalMergedCollection
        // }));
        this.setState({
          gridHeight: gridHeight,
          gridWidth: gridWidth,
          rows: rowsX,
          columns: columnsY,
          tiles: finalMergedCollection
        }, this.checkBoardTiles);
      })
      .catch((err) => {
        console.log('There was an error retrieving the data', err);
      })
  }

  checkBoardTiles() {
    const columnsY = this.state.columns;
    const rowsX = this.state.rows;
    const tiles = this.state.tiles;

    let flag = true;
    let counter = 0;
    for (var y = 0; y < columnsY; y++) {
      for (var x = 0; x < rowsX; x++) {
        //check current Board against actual board
        if (tiles[counter].currentPosition.x != tiles[counter].actualPosition.x || tiles[counter].currentPosition.y != tiles[counter].actualPosition.y) {
          flag = false;
          //alert('LOSER1')
        }
        //alert(tiles[counter].currentPosition.x)
        //alert(tiles[counter].currentPosition.y)
        counter++;
      }
    }
    if (flag) {
      alert('WINNER!')
    } else {
      alert('LOSER!')
    }
  }

  swapTiles() {
    //helpers.swapKeyValues(tile1, tile2, key);
    

    let selected = this.state.selectedTiles;
    let obj1 = selected[0];
    let obj2 = selected[1];
    helpers.swapKeyValues(obj1, obj2, 'currentPosition');
    helpers.swapKeyValues(obj1, obj2, 'url')
    //console.log(obj1)
    //console.log(obj2)


    //swap order in tiles array
    let tiles = this.state.tiles;
    let obj1Index = tiles.findIndex((tile) => {
      return tile.url === obj1.url
    })
    //alert(obj1Index)
    let obj2Index = tiles.findIndex((tile) => {
      return tile.url === obj2.url
    })
    let swap1 = helpers.swapValueAtIndex(tiles, obj1, obj1Index);
    let swap2 = helpers.swapValueAtIndex(swap1, obj2, obj2Index);

    //let swappedArr = helpers.swapOrderInArray(tiles, obj1Index, obj2Index);
    console.log(JSON.stringify(swap2, null, 4))
    //re-render
    this.setState((prevState) => ({
      selectedTiles: [],
      tiles: swap2
    }));
  }

  handleSelect(event) {
    event.stopPropagation();
    //console.log(event.target.src) //the url

    let tiles = this.state.tiles;
      let target = tiles.filter((tile) => {
        return tile.url == event.target.src;
      });
      //target[0] for the object
      let arr = this.state.selectedTiles;

    if (this.state.selectedTiles.length == 0) {
      arr.push(target[0]);
      this.setState((prevState) => ({
        selectedTiles: arr
      }));
    } else if (this.state.selectedTiles.length == 1) {
      if (arr[0].url === event.target.src) {
        arr.pop();
        this.setState((prevState) => ({
          selectedTiles: arr
        }));
      } else {
        arr.push(target[0]);
        this.setState({
          selectedTiles: arr
        }, this.swapTiles);
      }
    }
  }

  render() {

    //let rows = Math.ceil(this.state.data.levels[0].width / 512);
    //let columns = Math.ceil(this.state.data.levels[0].height / 512);

    if (this.state.tiles.length == 0) {
      return <h1>LOADING</h1>;
    } else {
        const gridHeight = this.state.gridHeight / 2;
        const gridWidth = this.state.gridWidth / 2;

        const tiles = this.state.tiles.map((tile) => {
          return <Tile url={tile.url}
                       key={tile.url}
                       onClick={this.handleSelect}

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
