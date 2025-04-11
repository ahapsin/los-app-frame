function useSearch(arr, searchKey) {
  return arr.filter(function (obj) {
    return Object.keys(obj).some(function (key) {
      let string = String(obj[key]).toLowerCase();
      return obj[key] != null && string.match(searchKey.toLowerCase());
    });
  });
}
export { useSearch };
