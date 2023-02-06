import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './2_components/Layout'
import Home from './5_pages/Home'
import './RootRouter.scss'

const NotFound = () => {
  return <div id='not-found'>
    404
  </div>
}

export default function RootRouter() {

  const [apiKey, setApiKey] = useState('')
  const [myDomain, setMyDomain] = useState('')

  useEffect(() => {
    localStorage.getItem('api-key', )
  }, [])

  return (
    <Routes>
      <Route path="/*" element={<Layout />}>
        <Route index element={<Home />} />
        <Route index element={<Home />} />
        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  )
};
