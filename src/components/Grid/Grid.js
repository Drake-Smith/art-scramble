import React          from 'react';
import styles         from './Grid.scss';
import styles2        from './../Tile/Tile.scss';

import axios          from 'axios'

import Tile           from './../Tile/Tile';
import SideInfoPanel  from './../SideInfoPanel/SideInfoPanel';

import { GET_TILES_URL,
         GET_INFO_URL, 
         BASE_URL, 
         GET_NEXT_PAINTING, 
         COLLECTION } from './../../config-key.js'
import * as helpers   from './../../helpers.js'

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

    this.grabPaintingInfo = this.grabPaintingInfo.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.swapTiles = this.swapTiles.bind(this);
    this.checkBoardTiles = this.checkBoardTiles.bind(this);
    this.showNextPainting = this.showNextPainting.bind(this);
  }

  componentDidMount() {
    //initial API call to grab paiting tiles + info
    this.grabPaintingInfo();
  }

  grabPaintingInfo() {
    //random painting getter function
    const chooser = GET_NEXT_PAINTING(COLLECTION);
    //get painting key
    const paintingKey = chooser();

    //form API URLs
    const infoURL = BASE_URL + paintingKey + GET_INFO_URL;
    const tilesURL = BASE_URL + paintingKey + GET_TILES_URL;

    const getPaintingInfo = () => axios.get(infoURL);
    const getTileInfo = () => axios.get(tilesURL);
    
    //run both API calls together
    axios.all([getPaintingInfo(), getTileInfo()])
      .then(axios.spread((paintingResponse, tileResponse) => { //both response objects

        //PAINTING INFO
        let infoObj = {};
        infoObj.title = paintingResponse.data.artObject.title;
        infoObj.painter = paintingResponse.data.artObject.principalMakers[0].name;
        infoObj.date = paintingResponse.data.artObject.dating.presentingDate;
        //console.log('paintingResponse', paintingResponse.data)

        //TILE INFO

        //identify and filter response object to set of tiles between 4 and 6
        //returns an array with 1 obj inside
        const collection = tileResponse.data.levels.filter((level) => {
          //return level.name === 'z2'
          return level.tiles.length <= 6 && level.tiles.length >= 4;
        })
        
        //create actualPosition key, move the API-provided x and y coordinate there
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

        //merge the keys of the two objects together to form one data obj
        let finalMergedCollection = [];
        for (var i = 0; i < tileMapping.length; i++) {
            let combined = Object.assign(tileMapping[i], modifiedTiles[i])
            finalMergedCollection.push(combined)
        }
        //console.log('THE FINAL OBJ')
        //console.log(JSON.stringify(finalMergedCollection, null, 4))
        
        //set all of the data to state
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
  }

  handleSelect(event) {
    event.stopPropagation();

    let tiles = this.state.tiles;

    //find the tile in our array of tiles that matches tile the user clicked
    let target = tiles.filter((tile) => {
      return tile.url === event.target.src;
    });
    //target[0] for the object

    let arr = this.state.selectedTiles;

    if (this.state.selectedTiles.length === 0) {
      //pass that tile into the selectedTiles arr
      arr.push(target[0]);
      //set styling to "selected" look
      event.target.style.opacity = '0.5';
      event.target.style.boxShadow = '10px 10px 5px 0px rgba(0,0,0,0.75)';

      this.setState((prevState) => ({
        selectedTiles: arr
      }));
    } else if (this.state.selectedTiles.length === 1) {
        //if user clicks on already-selected tile, then remove from selected array
        if (arr[0].url === event.target.src) {
          arr.pop();
          //reset styling back to normal tile look
          event.target.style.opacity = '1';
          event.target.style.boxShadow = 'none';

          this.setState((prevState) => ({
            selectedTiles: arr
          }));
        } else {
          //initiate swap of tiles
          arr.push(target[0]); //push 2nd tile into selectedTiles array

          event.target.style.opacity = '0.5';
          event.target.style.boxShadow = '10px 10px 5px 0px rgba(0,0,0,0.75)';

          //set state and then run swapTiles function
          this.setState({
            selectedTiles: arr
          }, this.swapTiles);
        }
    }
  }

  swapTiles() {

    // reset opacity of selected tiles back to 1
    let elements = document.getElementsByClassName(styles2.tileImg);
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.opacity = '1';
      elements[i].style.boxShadow = 'none';
    }

    let selected = this.state.selectedTiles;
    let obj1 = selected[0];
    let obj2 = selected[1];
    
    //swap the two selected tiles in the tiles array
    let tiles = this.state.tiles;

    //find index of both tiles
    let obj1Index = tiles.findIndex((tile) => {
      return tile.url === obj1.url
    })
    let obj2Index = tiles.findIndex((tile) => {
      return tile.url === obj2.url
    })

    //swap the values of url and position of the two tiles
    helpers.swapKeyValues(obj1, obj2, 'url')
    helpers.swapKeyValues(obj1, obj2, 'actualPosition');
    //console.log('obj1', obj1)
    //console.log('obj2', obj2)

    //swap the position of the two objects in the array of tiles
    let updatedTiles = helpers.swapValueAtIndex(tiles, obj1, obj1Index);
    helpers.swapValueAtIndex(updatedTiles, obj2, obj2Index);

    //update the state, and check board if correct position
    this.setState({
      selectedTiles: [],
      tiles: updatedTiles
    }, this.checkBoardTiles);
  }

  checkBoardTiles() {
    const columnsY = this.state.columns;
    const rowsX = this.state.rows;
    const tiles = this.state.tiles;

    let flag = true;
    let counter = 0;

    //run and check through board starting at x: 0, y: 0, then x:1, y:0 etc
    for (var y = 0; y < columnsY; y++) {
      for (var x = 0; x < rowsX; x++) {
        //check current Board positions against the actual positions
        if (tiles[counter].currentPosition.x !== tiles[counter].actualPosition.x || tiles[counter].currentPosition.y !== tiles[counter].actualPosition.y) {
          flag = false; //flagged to false if any tile is not in the final position
        }
        counter++;
      }
    }
    if (flag) { //all tiles are in correct final position
      this.setState((prevState) => ({
        winner: true
      }));
    } 
  }

  showNextPainting(event) {
    event.stopPropagation();

    //reset state and pull next painting
    this.setState({
      gridHeight: 0,
      gridWidth: 0,
      rows: 0,
      columns: 0,
      selectedTiles: [],
      tiles: [],
      paintingInfo: {},
      winner: false
    }, this.grabPaintingInfo);
  }

  render() {
    //loading view
    if (this.state.tiles.length === 0) {
      return (
        <div className={styles.pageBody}>
          <h1 className={styles.loadingMsg}>Loading...</h1>
        </div>
      )
    } else {
        const gridHeight = this.state.gridHeight / 2;
        const gridWidth = this.state.gridWidth / 2;

        const tileHeight = gridHeight / this.state.columns;
        const tileWidth = gridWidth / this.state.rows;

        //map through tiles array and create <Tile> components
        const tiles = this.state.tiles.map((tile) => {
          return <Tile url={tile.url}
                       key={tile.url}
                       onClick={this.handleSelect}
                       height={tileHeight}
                       width={tileWidth}
                  />
        });

        return (
          <div className={styles.pageBody}>
            <div className={styles.gridContainer} style={{height: gridHeight, width: gridWidth}}>
              {tiles}
            </div>
            <SideInfoPanel info={this.state.paintingInfo}
                           winner={this.state.winner} 
                           showNextPainting={this.showNextPainting} />
          </div>
        )
    }
  }
}

export default Grid;
