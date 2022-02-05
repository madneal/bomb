import {CDN_PATH} from '../../config/appConfig';
const chooseLocation = requirePlugin('chooseLocation');
var QQMapWX = require('../../lib/qqmap-wx-jssdk.min');
var qqmap = new QQMapWX({
  key: 'K7QBZ-KWXWJ-5PCF4-KZGF4-OM3HS-Y6F55'
})
var EARTH_RADIUS = 6378136.49;
Page({
  data: {
    imgs: {
			rightArrow: `${CDN_PATH}/iconArrowRight@3x.png`
		},
    location: null,
    array: [1, 5, 10, 20, 50],
    index: 1,
    stations: null,
    distance: 5000,
    result: {},
    parkingFree: true
  },
  rad(d) {
    return d * Math.PI / 180.0;
  },  
  getDistance(latFrom, lngFrom, latTo, lngTo) {
    var radLatFrom = this.rad(latFrom);
    var radLatTo = this.rad(latTo);
    var a = radLatFrom - radLatTo;
    var b = this.rad(lngFrom) - this.rad(lngTo);
    var distance = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLatFrom) * Math.cos(radLatTo) * Math.pow(Math.sin(b / 2), 2)));
    distance = distance * EARTH_RADIUS;
    distance = Math.round(distance * 10000) / 10000;
    return parseFloat(distance.toFixed(0));
  },
  compare(property){
    return function(obj1,obj2){
        var value1 = obj1[property];
        var value2 = obj2[property];
        return value1 - value2;    
    }
},
  onLoad() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
    const url = 'https://chargegateway.xiaopeng.com/front/charge/free/station/map';
    var that = this;
    if (!this.data.stations) {
      wx.request({
        url: url,
        success (res) {
          that.setData({
            stations: res.data.data.records
          })
        }
      });
    }
  },
  onChooseLocation () {
		const key = 'K7QBZ-KWXWJ-5PCF4-KZGF4-OM3HS-Y6F55';
		const location = this.data.location ? JSON.stringify(this.data.location) : '';
		const scale = 10;
		let url = 'plugin://chooseLocation/index?key=' + key + '&scale=' + scale + '&referer=xp';
		if (location) {
			url += '&location=' + location;
		}
		wx.navigateTo({
			url
		});
  },
  bindPickerChange: function(e) {
    const array = this.data.array;
    this.setData({
      distance: array[e.detail.value] * 1000,
      index: e.detail.value
    });
  },
  onShow () {
    const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
    this.setData({
      location: location
    });
},
onUnload () {
    chooseLocation.setLocation(null);
},
parkingFreeSwitch(e) {
  this.setData({
    parkingFree: e.detail.value
  })
},
search() {
  if (!this.data.location) {
    wx.showToast({
      title: '请选择搜索位置',
      icon: 'error'
    })
    return;
  }
  let result = [];
  const currentLocation = this.data.location;
  var that = this;
  this.data.stations.forEach(function(station) {
    const dis = that.getDistance(currentLocation.latitude, currentLocation.longitude, station.lat, station.lon);
    if (dis < that.data.distance) {
      const newStation = station;
      newStation.distance = dis;
      result.push(newStation);
    }
  })
  if (result.length === 0) {
    wx.showToast({
      title: '未搜索到站点',
      icon: 'error'
    })
    return;
  }
  result = result.sort(this.compare('distance'));
  const key = currentLocation.name + this.data.distance;
  wx.setStorage({
    key: key,
    data: result
  });
  wx.navigateTo({
    url: '/pages/stations/index?key='+key + '&parkingFree=' + this.data.parkingFree,
  })
}
});
