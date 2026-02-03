import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './Style/App.css';
import { Routes, Route} from 'react-router-dom';
import NavBar from './components/NavBar'
import TaskList from './pages/TaskList.jsx';
import AddTask from './pages/AddTask.jsx';
import Footer from './components/Footer.jsx';
import Register from './components/Register.jsx';
import Login from './components/Login.jsx';
import Protected from './components/Protected.jsx';
import Profile from './pages/Profile.jsx';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <NavBar />


      <Routes>
          <Route path="/" element={<Protected><TaskList /></Protected>}/>
          <Route path="/add" element={<Protected><AddTask /></Protected>}/>
          <Route path="/profile" element={<Protected><Profile /></Protected>}/>

          <Route path="/login" element={<Login />}/>
          <Route path="/register" element={<Register />}/>
      </Routes>
      <Footer />
    </>
  )
}

export default App
