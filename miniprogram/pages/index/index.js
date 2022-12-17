Page({
  data: {
    text: '',
    textRe: '(\d+)|([a-zA-Z0-9]+)|([a-zA-Z0-9_\-]+)',
    result: []
  },
  onLoad() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
    wx.getClipboardData({
      success: (res) => {
        if (res.data) {
          const data = res.data;
          wx.showModal({
            title: '提示',
            content: '是否粘贴剪切板内容',
            success: (res) => {
              if (res.confirm) {
                this.setData({
                  text: data
                });
              }
            }
          })
        }
      },
    })
  },
  onShow () {
},
onUnload () {
    chooseLocation.setLocation(null);
},
bindFormSubmit(e) {
  console.log(e.detail.value.text);
  this.setData({
    text: e.detail.value.text
  });
  const re = new RegExp(this.data.textRe, 'g');
  this.data.text = this.data.text.replace(/\r\n/g, '');
  this.data.text = this.data.text.replace(/\n/g, '');
  this.data.text = this.data.text.replace(/\n(\n)*( )*(\n)*\n/g, '');
  const result = this.data.text.match(re);
  this.setData({
    result: result
  });
},
clear() {
  this.setData({
    text: '',
    result: []
  });
},
copy(e) {
  wx.setClipboardData({
    data: e.currentTarget.dataset.text,
  })
}
});
