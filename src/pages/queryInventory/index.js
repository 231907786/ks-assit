import React from 'react'
import './index.css'
import {av} from '../../db'

export default class QueryInventory extends React.Component {

  state = {
    username: '',
    password: '',
    disabled: true,
    prompt: '查询库存',
    result: [],
    discountMap: {
      100: '全价',
      70: '七折',
    },
    countDownSec: 15,
  }

  handleUsername = e => {
    const username = e.target.value
    if (username.length > 5 && this.state.password.length > 5) {
      if (this.state.disabled) this.setState({disabled: false, username})
      else this.setState({username})
    }else {
      if (!this.state.disabled) this.setState({disabled: true, username})
      else this.setState({username})
    }
  }

  handlePassword = e => {
    const password = e.target.value
    if (password.length > 5 && this.state.username.length > 5) {
      if (this.state.disabled) this.setState({disabled: false, password})
      else this.setState({password})
    }else {
      if (!this.state.disabled) this.setState({disabled: true, password})
      else this.setState({password})
    }
  }

  handleSubmit = async() => {
    this.countDown('请稍候...', this.state.countDownSec, 'prompt')
    let result = await av.Cloud.run('inventory', {username: this.state.username, password: this.state.password})
    result = Object.keys(result).map(key => ({
      ...result[key],
      discount: this.state.discountMap[key],
    }))
    this.setState({result})
  }

  countDown = (prefixStr, sec, key) => {
    this.setState({[key]: `${prefixStr}${sec}`})
    this.interval = setInterval(() => this.setState(
      {[key]: `${prefixStr}${--sec}`},
      () => {
        if (!sec) {
          this.setState({[key]: prefixStr})
          clearInterval(this.interval)
        }
      }
    ), 1000)
  }

  componentWillUnmount() {
    this.interval && clearInterval(this.interval)
  }


  render() {
    return (
      <div className="wrap">
          {!this.state.result.length ? (
            <div className="container">
              <div>
                <span>专卖店账号:</span>
                <div>
                  <input type="text" onChange={this.handleUsername} value={this.state.username} />
                </div>
              </div>
              <div>
                <span>密码:</span>
                <div>
                  <input type="password" onChange={this.handlePassword} value={this.state.password} />
                </div>
              </div>
              <button disabled={this.state.disabled} onClick={this.handleSubmit}>{this.state.prompt}</button>
            </div>
          ): (
            <div className="container" style={{padding: 0, border: 0}}>
              <table>
                <thead>
                  <tr>
                    <th>折扣</th>
                    <th>总金额</th>
                    <th>&nbsp;总pv&nbsp;</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.result.map(({
                    discount,
                    money,
                    pv,
                  }, i) => (
                    <tr key={i}>
                      <td>{discount}</td>
                      <td>{money}元</td>
                      <td>{pv}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>
    )
  }
}
