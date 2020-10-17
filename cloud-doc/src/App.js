import React from 'react';
import FileSearch from './components/FileSearch'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import FileList from './components/FileList'
import defaultFiles from './utils/defaultFiles'

function App() {
  return (
    <div className="App container-fluid">
      <div className="row">
          <div className= "col bg-danger left-panel">
            <FileSearch 
              title='Cloud Search'
            />
            <FileList
              files={defaultFiles}
              // onFileClick={(id)=> {console.log(id)}}
              onFileClick={(id) => { console.log(id)}}
              onFileDelete={(id) => { console.log('delete', id)}}
              onSaveEdit={(id, newValue) => {console.log(id); console.log(newValue)}}
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
