import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './Style/App.css';
import { Routes, Route} from 'react-router-dom';
import NavBar from './components/NavBar'
import TaskList from './pages/TaskList.jsx';
import AddTask from './pages/AddTask.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <NavBar />

      <Routes>
          <Route path="/" element={<TaskList />}/>
          <Route path="/add" element={<AddTask />}/>
      </Routes>

    </>
  )
}

export default App
