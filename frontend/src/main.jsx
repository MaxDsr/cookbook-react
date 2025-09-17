import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { auth0Config } from './config/auth0'
import { store } from './store/store'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <Auth0Provider
        {...auth0Config}
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Auth0Provider>
    </Provider>
  </StrictMode>,
)
