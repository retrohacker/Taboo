import React from 'react'
import './Loading.css'
import './loading_lib.css'
import icon from './loading.svg'

class Loading extends React.PureComponent {
  render () {
    return <img alt='Loading...' class='Loading ld ld-spin-fast' src={icon} />
  }
}

export default Loading
