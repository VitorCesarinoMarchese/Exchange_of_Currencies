import { BrowserRouter, Routes, Route } from "react-router"
import Home from "./pages/home"
import Login from "./pages/login"
import Register from "./pages/register"
import { PrivateRoutes } from "./components/privateRoutes"
import Dashboard from "./pages/dashboard"
import History from "./pages/history"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Register/>}/>
        <Route element={<PrivateRoutes/>}>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/history" element={<History/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
