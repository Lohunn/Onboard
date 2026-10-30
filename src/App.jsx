import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Boards from './pages/Boards'
import BoardDetail from './pages/BoardDetail'
import Learn from './pages/Learn'
import Projects from './pages/Projects'
import About from './pages/About'
import VirtualLab from './pages/VirtualLab'
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="boards" element={<Boards />} />
          <Route path="boards/:boardId" element={<BoardDetail />} />
          <Route path="learn" element={<Learn />} />
          <Route path="projects" element={<Projects />} />
          <Route path="about" element={<About />} />
        </Route>
        <Route path="lab" element={<VirtualLab />} />
      </Routes>
    </BrowserRouter>
  )
}
