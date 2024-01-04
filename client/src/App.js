import { Route, BrowserRouter as Router, Routes }
  from 'react-router-dom';
import { Homepage, Chatpage } from './pages'
import './App.css'
const App = () => {
  return (
    <main className='App'>
      <Router>
        <Routes>
          <Route path='/' element={<Homepage />} />
          <Route path='/chats' element={<Chatpage />} />
        </Routes>
      </Router>
    </main>
  )
}

export default App