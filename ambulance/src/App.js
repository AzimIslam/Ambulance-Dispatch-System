import React, {useState} from "react";

// We use Route in order to define the different routes of our application
import { Route, Routes, BrowserRouter} from "react-router-dom";
import { SignIn } from "./components/SignIn";
import 'bootstrap/dist/css/bootstrap.css';
import { useNavigate } from 'react-router';
import ControlPanel from "./components/ControlPanel";
import NotFound from "./components/NotFound";

function App() {
    return (
    <BrowserRouter>
      <Routes>
          <Route exact path="/ambulance" element={<SignIn navigate={useNavigate} />} />
          <Route exact path="/ambulance/controlPanel" element={<ControlPanel />} />
          <Route exact path="/ambulance/*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    );
}

export default App;