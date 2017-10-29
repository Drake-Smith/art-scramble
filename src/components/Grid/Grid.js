import React from 'react';
import styles from './Grid.scss';
import styles2 from './../Tile/Tile.scss';
import axios  from 'axios'

import Tile from './../Tile/Tile';
import SideInfoPanel from './../SideInfoPanel/SideInfoPanel';
import { GET_TILES_URL, GET_INFO_URL } from '../../config-key.js'
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
      tiles: [],
      paintingInfo: {},
      winner: false
    }

    this.checkBoardTiles = this.checkBoardTiles.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.swapTiles = this.swapTiles.bind(this);
    this.grabDisplayInfo = this.grabDisplayInfo.bind(this);
  }

  componentDidMount() {
    //retrieve art tiles
    // axios.get(GET_INFO_URL)
    //   .then((response) => {
        
    //   })
    //   .catch((err) => {
    //     console.log('There was an error retrieving paining info.', err);
    //   })
    const getTileInfo = () => axios.get(GET_TILES_URL);
    const getPaintingInfo = () => axios.get(GET_INFO_URL);

    axios.all([getPaintingInfo(), getTileInfo()])
      .then(axios.spread((paintingResponse, response) => {

        //PAINTING INFO
        let infoObj = {};
        infoObj.title = paintingResponse.data.artObject.title;
        infoObj.painter = paintingResponse.data.artObject.principalMakers[0].name;
        infoObj.date = paintingResponse.data.artObject.dating.presentingDate;
        //console.log('paintingResponse', paintingResponse.data)

        //PAINTING TILES
         //identify and filter response object to just zoom level 2 array
        //returns an array with 1 obj inside
        const collection = response.data.levels.filter((level) => {
          //return level.name === 'z2'
          return level.tiles.length <= 6 && level.tiles.length >= 4;
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
        //console.log('THE FINAL OBJ')
        //console.log(JSON.stringify(finalMergedCollection, null, 4))

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
          tiles: finalMergedCollection,
          paintingInfo: infoObj
        }, this.checkBoardTiles);
      }))
      .catch((err) => {
        console.log('There was an error retrieving data.', err);
      })

    // axios.get(GET_TILES_URL)
    //   .then((response) => {
        
    //     //identify and filter response object to just zoom level 2 array
    //     //returns an array with 1 obj inside
    //     const collection = response.data.levels.filter((level) => {
    //       //return level.name === 'z2'
    //       return level.tiles.length <= 6 && level.tiles.length >= 4;
    //     })
        
    //     //create actualPosition key, move the x and y coordinate there
    //     //returns Array of Objects
    //     let tileMapping = collection[0].tiles.map((tile) => ({
    //       actualPosition: {
    //         x: tile.x,
    //         y: tile.y
    //       },
    //       url: tile.url
    //     }));

    //     //grab the painting's total height and width
    //     const gridHeight = collection[0].height;
    //     const gridWidth = collection[0].width;
        
    //     //determine number of rows and columns 
    //     const rowsX = Math.ceil(gridWidth / 512);
    //     const columnsY = Math.ceil(gridHeight / 512);

    //     //console.log('HOW MANY ROWS?', rowsX)
    //     //console.log('HOW MANY COLUMNS?', columnsY)
        
    //     //create new array of objects and assign the tile's current x and y position
    //     //this will later merge with our collection array
    //     let modifiedTiles = [];
    //     //add the current position of tile 
    //     for (var y = 0; y < columnsY; y++) {
    //       for (var x = 0; x < rowsX; x++) {
    //         let current = {
    //           currentPosition: {
    //             x: x,
    //             y: y
    //           }
    //         }
    //         modifiedTiles.push(current);      
    //       }
    //     }

    //     //console.log(JSON.stringify(modifiedTiles, null, 4))
    //     let finalMergedCollection = [];
    //     for (var i = 0; i < tileMapping.length; i++) {
    //         let combined = Object.assign(tileMapping[i], modifiedTiles[i])
    //         finalMergedCollection.push(combined)
    //     }
    //     //console.log('THE FINAL OBJ')
    //     //console.log(JSON.stringify(finalMergedCollection, null, 4))

    //     // this.setState((prevState) => ({
    //     //   gridHeight: gridHeight,
    //     //   gridWidth: gridWidth,
    //     //   rows: rowsX,
    //     //   columns: columnsY,
    //     //   tiles: finalMergedCollection
    //     // }));
    //     this.setState({
    //       gridHeight: gridHeight,
    //       gridWidth: gridWidth,
    //       rows: rowsX,
    //       columns: columnsY,
    //       tiles: finalMergedCollection
    //     }, this.checkBoardTiles);
    //   })
    //   .catch((err) => {
    //     console.log('There was an error retrieving the data', err);
    //   })
  }

  grabDisplayInfo() {

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
      //alert('WINNER!')
      this.setState((prevState) => ({
        winner: true
      }));
    } else {
      //alert('LOSER!')
    }
  }

  swapTiles() {
    //helpers.swapKeyValues(tile1, tile2, key);

    // set opacity of all tiles back to 1
    let elements = document.getElementsByClassName(styles2.tileImg);
    console.log('ELEMENTS', elements)
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.opacity = '1';
      elements[i].style.boxShadow = 'none';
    }

    let selected = this.state.selectedTiles;
    let obj1 = selected[0];
    let obj2 = selected[1];
    
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

    //helpers.swapKeyValues(obj1, obj2, 'currentPosition');
    helpers.swapKeyValues(obj1, obj2, 'url')
    helpers.swapKeyValues(obj1, obj2, 'actualPosition');
    console.log('obj1', obj1)
    console.log('obj2', obj2)

    let swap1 = helpers.swapValueAtIndex(tiles, obj1, obj1Index);
    helpers.swapValueAtIndex(swap1, obj2, obj2Index);

    //let swappedArr = helpers.swapOrderInArray(tiles, obj1Index, obj2Index);
    //console.log(JSON.stringify(swap1, null, 4))
    //re-render
    // this.setState((prevState) => ({
    //   selectedTiles: [],
    //   tiles: swap2
    // }));
    

    this.setState({
      selectedTiles: [],
      tiles: swap1
    }, this.checkBoardTiles);
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
      event.target.style.opacity = '0.5';
      event.target.style.boxShadow = '10px 10px 5px 0px rgba(0,0,0,0.75)';
      this.setState((prevState) => ({
        selectedTiles: arr
      }));
    } else if (this.state.selectedTiles.length == 1) {
      if (arr[0].url === event.target.src) {
        arr.pop();
        event.target.style.opacity = '1';
        event.target.style.boxShadow = 'none';
        this.setState((prevState) => ({
          selectedTiles: arr
        }));
      } else {
        arr.push(target[0]);
        event.target.style.opacity = '0.5';
        event.target.style.boxShadow = '10px 10px 5px 0px rgba(0,0,0,0.75)';
        this.setState({
          selectedTiles: arr
        }, this.swapTiles);
      }
    }
  }

  render() {

    //let rows = Math.ceil(this.state.data.levels[0].width / 512);
    //let columns = Math.ceil(this.state.data.levels[0].height / 512);
    //console.log(JSON.stringify(this.state.tiles, null, 4))
    if (this.state.tiles.length == 0) {
      return (
        <div className={styles.pageBody}>
          <h1 className={styles.loadingMsg}>Loading...</h1>
        </div>
      )
    } else {
        //const gridHeight = this.state.gridHeight / this.state.columns;
        //const gridWidth = this.state.gridWidth / this.state.rows;
        const gridHeight = this.state.gridHeight / 2;
        const gridWidth = this.state.gridWidth / 2;

        const tileHeight = gridHeight / this.state.columns;
        const tileWidth = gridWidth / this.state.rows;


        const tiles = this.state.tiles.map((tile) => {
          return <Tile url={tile.url}
                       key={tile.url}
                       onClick={this.handleSelect}
                       height={tileHeight}
                       width={tileWidth}

                  />
                  //onClick={this.handleSwap}
                  // actualPos={actualPos}
                  // currentPos={currentPos}
          });
        return (
          <div className={styles.pageBody}>
            <div className={styles.gridContainer} style={{height: gridHeight, width: gridWidth}}>
              {tiles}
            </div>
            <SideInfoPanel info={this.state.paintingInfo} winner={this.state.winner} />
          </div>
        )
    }
  }
}

export default Grid;
