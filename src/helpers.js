export const isEmpty = (obj) => {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
};

export const swapKeyValues = (obj1, obj2, key) => {
  let temp = obj1[key];
  obj1[key] = obj2[key];
  obj2[key] = temp;
};

export const swapOrderInArray = (array, index1, index2) => {
  let temp = array[index1];
  array[index1] = array[index2];
  array[index2] = temp;
  return array;
}

export const swapValueAtIndex = (arr, newValue, index) => {
  arr[index] = newValue;
  return arr;
}
