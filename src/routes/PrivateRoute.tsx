import React from 'react'
import { getUserInfo } from '../pages/Authentication/services'
import { Navigate } from 'react-router-dom'


export default function PrivateRoute({ children } : { children : React.ReactElement}) {
  const user = getUserInfo()
  if(!user) return <Navigate to={"/auth/signin"}  replace/>
  return children
}
