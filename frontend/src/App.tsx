import React from 'react'
import { Routes, Route } from 'react-router-dom'
import NotFound from './pages/NotFound'


const App = () => {
  return (
    <div>
      <Routes>
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App