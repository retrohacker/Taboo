import React from 'react'
import './Navbar.css'
import sne from './sne.png'

export default class Navbar extends React.PureComponent {
  render () {
    return (
      <div className='Navbar'>
        <img alt='Taboo Logo' src={sne} className='Navbar_Logo' />
        <p className='Navbar_Title'> Taboo </p>
      </div>
    )
  }
}
