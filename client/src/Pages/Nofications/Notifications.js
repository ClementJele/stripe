import React from 'react'
import Sidebar from '../../components/sidebar'
import Review from '../../components/Review'
import SearchBar from '../../components/SearchBar'

function notifications ()  {
  return (
    <div className='DashboardContainer'>
        <Sidebar/>
        <div className='ContentArea'>
            <h3>Notifications</h3>
            <SearchBar/>
        </div>
    </div>
  )
}

export default notifications