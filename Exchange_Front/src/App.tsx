import { BrowserRouter, Routes, Route } from "react-router"
import Home from "./pages/home"
import Login from "./pages/login"
import Register from "./pages/register"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Register/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
