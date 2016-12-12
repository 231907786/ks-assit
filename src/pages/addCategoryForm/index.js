import React, { Component } from 'react';
import './index.css';
import {
  av,
  insertOrUpdate,
} from '../../db'

// insertOrUpdate(
//   'Todo',
//   ['product_id', 'a004'],
//   {
//     a: 11,
//     b: 22,
//     c: 55,
//   },
// ).then(
//   res => console.log(res),
//   err => console.log(err),
// )

class App extends Component {

  state = {
    'product_id': '',
    name: '',
    discount: '',
    price: '',
    pv: '',
  }

  onChangeId = e => this.setState({product_id: e.target.value.toUpperCase()})
  onChangeName = e => this.setState({name: e.target.value})
  onChangeDiscount = e => {
    !isNaN(e.target.value) && this.setState({discount: e.target.value})
  }
  onChangePrice = e => this.setState({price: e.target.value})
  onChangePv = e => this.setState({pv: e.target.value})
  onSubmit = e => {
    e.preventDefault()
    const dataObj = {
      'product_id': this.state['product_id'],
      [this.state.discount]: {
        price: +this.state.price,
        pv: +this.state.pv,
      },
    }
    if (this.state.name) dataObj.name = this.state.name
    insertOrUpdate(
      'ProductPrice',
      ['product_id', this.state['product_id']],
      dataObj,
    ).then(
      res => {
        this.setState({
          'product_id': '',
          name: '',
          price: '',
          pv: '',
        })
        this.refs['product_id'].focus()
      },
      err => console.error(err)
    )
  }

  render() {
    return (
      <form onSubmit={this.onSubmit} className="container">
        <div className="row">
          <label>折扣</label>
          <input type="text" value={this.state.discount} onChange={this.onChangeDiscount}/>
        </div>
        <div className="row">
          <label>代码</label>
          <input ref="product_id" type="text" value={this.state.product_id} onChange={this.onChangeId} autoFocus/>
        </div>
        <div className="row">
          <label>名称</label>
          <input type="text" value={this.state.name} onChange={this.onChangeName}/>
        </div>
        <div className="row">
          <label>积分</label>
          <input type="text" value={this.state.pv} onChange={this.onChangePv}/>
        </div>
        <div className="row">
          <label>价格</label>
          <input type="text" value={this.state.price} onChange={this.onChangePrice}/>
        </div>
        <input type="submit" value="提交" />
      </form>
    );
  }
}

export default App;
