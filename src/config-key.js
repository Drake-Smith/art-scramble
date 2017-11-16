export const BASE_URL = 'https://www.rijksmuseum.nl/api/en/collection/';
export const GET_TILES_URL = '/tiles?key=' + process.env.REACT_APP_API_KEY + '&format=json';
export const GET_INFO_URL = '?key=' + process.env.REACT_APP_API_KEY + '&format=json';

export const COLLECTION = ['SK-A-4691', 'SK-A-4717', 'SK-A-3276', 'SK-A-3066']; // implement multiple in future

//returns function to get random painting from COLLECTION array, does not repeat painting until all in array are selected once
export const GET_NEXT_PAINTING = (collectionArr) => {
  let copy = collectionArr.slice(0);

  return () => {
    if (copy.length < 1) {
      copy = collectionArr.slice(0);
    }
    let index = Math.floor(Math.random() * copy.length);
    let painting = copy[index];
    copy.splice(index, 1);
    return painting;    
  }
};


