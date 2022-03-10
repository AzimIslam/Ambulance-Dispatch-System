import React from "react";

// We use Route in order to define the different routes of our application
import { Route, Routes, BrowserRouter} from "react-router-dom";
import { SignIn } from "./components/SignIn";
import { ControlPanel } from "./components/ControlPanel/ControlPanel";
import 'bootstrap/dist/css/bootstrap.css';
import { useNavigate } from 'react-router';
import NotFound from "./components/NotFound";

function App() {
  return (
  <BrowserRouter>
    <Routes>
        <Route exact path="/dispatcher/" element={<SignIn navigate={useNavigate} />} />
        <Route path="/dispatcher/dashboard/*" element={<ControlPanel />} />
        <Route path="/dispatcher/*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
