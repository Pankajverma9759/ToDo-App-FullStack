import React from 'react'
import { Link } from 'react-router-dom'
import '../Style/navbar.css';
export default function NavBar() {
  return (
    <div>
         <nav className='navbar'>
           <div className='logo'>Todo App</div>
           <ul className='nav-links'>

              <li>
                <Link to='/'>List</Link>
              </li>

              <li>
                <Link to='/add'>Add List</Link>
              </li>
           </ul>
         </nav>
    </div>
  )
}
