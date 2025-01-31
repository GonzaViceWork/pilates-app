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
import ClientsPage from "./pages/clients/ClientsPage";
import ClientDetailPage from "./pages/clients/ClientDetailPage";
import CreateClientPage from "./pages/clients/CreateClientPage";
import EditClientPage from "./pages/clients/EditClientPage";
import CalendarPage from "./pages/calendar/CalendarPage";
import CreateSessionPage from "./pages/calendar/CreateSessionPage";
import EditSessionPage from "./pages/calendar/EditSessionPage";
import SessionDetailPage from "./pages/calendar/SessionDetailPage";
import PackagePage from "./pages/packages/PackagePage";
import CreatePackagePage from "./pages/packages/CreatePackagePage";
import EditPackagePage from "./pages/packages/EditPackagePage";
import NavBar from "./components/NavBar";

const App = () => {
    return (
        <Router>
            <NavBar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/clients/" element={<ClientsPage />} />
                <Route path="/clients/new/" element={<CreateClientPage />} />
                <Route path="/clients/:client_id/" element={<ClientDetailPage />} />
                <Route path="/clients/:client_id/edit" element={<EditClientPage />} /> 
                <Route path="/calendar/" element={<CalendarPage />} />
                <Route path="/calendar/new" element={<CreateSessionPage />} />
                <Route path="/calendar/:session_id/" element={<SessionDetailPage />} />
                <Route path="/calendar/:session_id/edit" element={<EditSessionPage />} />
                <Route path="/packages/" element={<PackagePage />} />
                <Route path="/packages/new/" element={<CreatePackagePage />} />
                <Route path="/packages/:package_id/edit" element={<EditPackagePage />} />
            </Routes>
        </Router>
    );
};

export default App;
