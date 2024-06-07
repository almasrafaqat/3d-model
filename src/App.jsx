import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from './layout/layout';
import HomePage from './pages/HomePage';
import CanvasComponent from './component/canvas-component/canvas-component';


const About = () => {
  return (
    <h2>This is About</h2>
  )
}
function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/model/:slug" element={<CanvasComponent />} />
          </Route>
        </Routes>

      </Router>
    </>
  )
}

export default App
