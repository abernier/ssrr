import React from "react"

import {getContext} from 'ssrr/browser'

class Homepage extends React.Component {
  constructor(props) {
    super(props)

    const context = getContext(this)

    this.state = {
      you: context?.data?.you
    }
  }

  componentDidMount() {
    this.constructor.fetchInitialData().then(data => {
      this.setState({you: data.you})
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
Homepage.fetchInitialData = () => {
  return new Promise(resolve => setTimeout(() => resolve({you: 'sexy'}), 3000))
}

export default Homepage
