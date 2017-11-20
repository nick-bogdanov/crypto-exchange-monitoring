import React from 'react'
import ReactDOM from 'react-dom'
import web from './browser.svg'
import { Init } from './components/Init'

function App () {
  return (
      <Init />
  )
}

ReactDOM.render(<App />,  document.getElementById('root'));
