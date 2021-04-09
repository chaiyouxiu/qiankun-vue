export const inlineWebSocket = (that, ACCESS_TOKEN) => {
  let host = document.location.host

  // 获取连接websocket地址
  const IS_HTTPS = document.location.protocol.includes('https')
  let wsProtocol = IS_HTTPS ? 'wss://' : 'ws://'
  let url = `${wsProtocol}${host}`
  
  // 重连次数累计，3次+则停止无效连接
  let time = 0

  let socket = {
    init() {
      // ws initialize
      this.wsUri = url
      this.webscoket = new WebSocket(url)
      this.webscoket.onopen = (evt) => {
        let { readyState } = this.webscoket
        if (+readyState === 1) time = 0
        // 建立连接发送数据
        const data = {
          cmd: "rgb",
          system: 77, // 
          access_token: ACCESS_TOKEN
        }
        console.log('webSocket-Connection-established')
        // 发送数据
        this.webscoket.send(JSON.stringify(data))
      }
      // 正在建立连接/连接成功建立/连接正在进行关闭握手，即将关闭/连接已经关闭或者根本没有建立
      this.webscoket.onreadyStateChange = () => {
        console.log(this.webscoket.readyState)
      }
      // webscoket关闭
      this.webscoket.onclose = () => {
        console.log('webSocket close')
        if (time >= 3) {
          return false
        } else {
          time++
          this.init()
        }
      }
      // webscoket返回信息
      this.webscoket.onmessage = (e) => {
        let isString = typeof e.data === 'string'
        let d = isString ? JSON.parse(e.data) : e.data
        that.updateUnreadMsgNum({payload}) // 更新未读消息数量
        that.$internalNotify({ // some options}) // 通知
          this.webscoket.onerror = (e) => {
            console.log('WebSocket has been shut down in accident,the following is the error emssage,please ask for technological support!!')
            console.log('we are trying to reconnect')
          }
          return this
        }),
        shutWebSocket() {
          time = 3
          this.webscoket.close()
          return this
        }
      }
      return socket
    }
  }
}
