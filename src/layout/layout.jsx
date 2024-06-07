import  { Fragment } from 'react'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <Fragment>
      <h1>Header</h1>
      <main>
        <Outlet />
      </main>
    </Fragment>
  )
}

export default Layout