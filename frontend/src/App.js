// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ClientsPage from "./pages/ClientsPage";
import ClientDetailPage from "./pages/ClientDetailPage";
import CreateClientPage from "./pages/CreateClientPage";
import EditClientPage from "./pages/EditClientPage";
import CalendarPage from "./pages/CalendarPage";
import CreateSessionPage from "./pages/CreateSessionPage";
import SessionDetailPage from "./pages/SessionDetailPage";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/clients/" element={<ClientsPage />} />
                <Route path="/clients/new/" element={<CreateClientPage />} />
                <Route path="/clients/:client_id/" element={<ClientDetailPage />} />
                <Route path="/clients/:client_id/edit" element={<EditClientPage />} /> 
                <Route path="/calendar/" element={<CalendarPage />} />
                <Route path="/calendar/new" element={<CreateSessionPage />} /> {/* Ruta para crear sesión */}
                <Route path="/calendar/:session_id/" element={<SessionDetailPage />} />
            </Routes>
        </Router>
    );
};

export default App;
