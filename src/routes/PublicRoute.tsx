import React from 'react'
import { getUserInfo } from '../pages/Authentication/services'
import { Navigate } from 'react-router-dom'


export default function PublicRoute({ children } : { children : React.ReactElement}) {
  const user = getUserInfo()
  if(user) return <Navigate to={"/"}  replace/>
  return children
}
