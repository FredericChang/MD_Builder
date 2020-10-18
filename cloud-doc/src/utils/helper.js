export const flattenArr = (arr) => {
    return arr.reduce((map, item) => {
      map[item.id] = item
      return map
    }, {})
  }
  
export const objToArr = (obj) => {
    console.log("obj")
    return Object.keys(obj).map(key => obj[key])
  }
  