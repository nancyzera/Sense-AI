import React from 'react'
import { Routes, Route } from 'react-router-dom'
import NotFound from './pages/NotFound'
import LandingPage from './pages/LandingPage'
import Dashbaord from './pages/dashboard/Dashboard'
import Chat from './pages/dashboard/Chat'
import Agents from './pages/dashboard/Agents'
import Wearables from './pages/dashboard/Wearables'
import Learning from './pages/dashboard/Learning'
import Payments from './pages/dashboard/Payments'
import Developer from './pages/dashboard/Developer'
import Settings from './pages/dashboard/Settings'
import Tools from './pages/dashboard/Tools'


const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/app/chat' element={<Chat />} />
        <Route path='/app/tools' element={<Tools />} />
        <Route path='/app/agents' element={<Agents />} />
        <Route path='/app/wearables' element={<Wearables />} />
        <Route path='/app/ai-learning' element={<Learning />} />
        <Route path='/app/payments' element={<Payments />} />
        <Route path='/app/developers' element={<Developer />} />
        <Route path='/app/settings' element={<Settings />} />
        <Route path='/app' element={<Dashbaord />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App