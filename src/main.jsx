import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from './context/context'
import './index.css'
import Layout from './layout/Layout'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider>
      <Layout />
    </Provider>
  </StrictMode>,
)
