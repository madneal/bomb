function diffArray(arr1, arr2) {
  var newArr = [];
  // Same, same; but different.
  newArr = arr1.concat(arr2);
  console.log('the new Arr is:'+newArr);
  var temp = [];
  for (var i in newArr){
    if (temp.indexOf(newArr[i])!=-1){
      temp.splice(temp.indexOf(newArr[i]),1);
    }
    else
      {
        temp.push(newArr[i]);
      }
  }
  return temp;
}

diffArray([1, 2, 3, 5], [1, 2, 3, 4, 5]);

//删除数组中重复的元素
function diffArray1(arr1,arr2) {
  var arr = [];
  arr = arr1.concat(arr2);
  var temp = [];
  //把arr的元素值和键值交换，因为键值不会重复
  for (var i in arr) {
    temp[arr[i]] = 1;
  }

}