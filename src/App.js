import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import Signin from "./components/Auth/Signin";
import SignUp from "./components/Auth/Signup"
import {useContext } from "react";
import { AuthContext} from "./context/AuthContext";

function App() {
  const {token}=useContext(AuthContext);

  return (
      <div className="App">
        <Router>
          <Routes>
            <Route exact path="/" element={token ? <Home></Home> : <Signin></Signin>}></Route>
            <Route path="/signin" element={<Signin></Signin>}></Route>
            <Route path="/signup" element={<SignUp></SignUp>}></Route>
          </Routes>
        </Router>
      </div>
  );
}

export default App;
