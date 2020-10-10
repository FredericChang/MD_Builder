import React from 'react';
import FileSearch from './components/FileSearch'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    <div className="App container-fluid">
      <div className="row">
          <div className= "col bg-danger left-panel">
            <FileSearch 
              title='CloudFile'
              onFileSearch={(value) => { console.log(value)}}
            />
          </div>
          <div className= "col bg-primary right-panel">
            <h1> right</h1>
          </div>
      </div>
    </div>
  );
}

export default App;
