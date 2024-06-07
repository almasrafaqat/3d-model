import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ModelConfiguratorProvider } from './context/ModelConfigurator'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ModelConfiguratorProvider>
      <App />
    </ModelConfiguratorProvider>
  </React.StrictMode>,
)
