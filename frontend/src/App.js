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

import React from 'react';
import Clients from './components/Clients';
import Sessions from './components/Sessions';

function App() {
    return (
        <div className="App">
            <h1>Gestión de Clientes</h1>
            <Clients />

            <h1>Gestión de Sesiones</h1>
            <Sessions />
        </div>
    );
}

export default App;
