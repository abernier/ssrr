import React from "react"

import {getSSRContext} from 'ssrr/browser'

class Homepage extends React.Component {
  static fetchInitialData() {
    console.log('fetchInitialData...')
    
    return new Promise(resolve => setTimeout(() => resolve({you: 'sexy'}), 3000))
  }

  constructor(props) {
    super(props)

    this.ssrContext = getSSRContext(this)

    this.state = this.init(this.ssrContext?.data)
  }

  init(data) {
    return {you: data?.you}
  }

  componentDidMount() {
    this.ssrContext || this.constructor.fetchInitialData().then(data => {
      this.setState(this.init(data))
    })
  }

  render() {
    if (!this.state.you) return 'loading...'
    
    return (
      <>
        <h1>Hi {this.state.you}!</h1>
      </>
    );
  }
}

export default Homepage
