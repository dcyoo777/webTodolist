import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import './TopNav.scss'

const TopNav = function () {

  const reset = useCallback(() => {
    window.location.reload()
  }, [])

  return <div className='top-nav'>
    <nav>
      <Link to={'/'} onClick={reset}>
        Todo List
      </Link>
    </nav>
  </div>
}

export default TopNav
