import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import Home from './pages/Home';
import Boards from './pages/Boards';
import BoardDetail from './pages/BoardDetail';
import Learn from './pages/Learn';
import Projects from './pages/Projects';
import About from './pages/About';
import Achievements from './pages/Achievements';
import Profile from './pages/Profile';
import VirtualLab from './pages/VirtualLab';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="boards" element={<Boards />} />
            <Route path="boards/:boardId" element={<BoardDetail />} />
            <Route path="learn" element={<Learn />} />
            <Route path="projects" element={<Projects />} />
            <Route path="about" element={<About />} />
            <Route path="achievements" element={<Achievements />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="lab" element={<VirtualLab />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
