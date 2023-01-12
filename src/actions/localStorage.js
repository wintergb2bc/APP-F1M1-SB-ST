//用來模擬mobile代碼，這樣vendor版本升級，可以直接覆蓋，不用修改
let mockLocalStorage = {
  getItem: (key) => {
    let data = global.window[key];
    if (!data || data == undefined || data.length == 0){
      return null; //找不到 要返回null 不然接JSON.parse會報錯
    }
    return data;
  },
  setItem: (key, value) => {
    global.window[key] = value;
  },
  removeItem: (key) => {
    delete global.window[key];
  },
}

// 全局变量
global.localStorage = mockLocalStorage;