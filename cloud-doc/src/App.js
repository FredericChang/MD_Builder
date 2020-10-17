import React from 'react';
import { faPlus, faFileImport } from '@fortawesome/free-solid-svg-icons'
import FileSearch from './components/FileSearch'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import FileList from './components/FileList'
import defaultFiles from './utils/defaultFiles'
import BottomBtn from './components/BottomBtn'

function App() {
  return (
    <div className="App container-fluid px-0">
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
            <div className="row no-gutters">
              <div className="col"> 
                <BottomBtn 
                  text="New" 
                  colorClass="btn-primary" 
                  icon={faPlus}
                />
              </div>
              <div className="col"> 
                <BottomBtn 
                  text="Import" 
                  colorClass="btn-success" 
                  icon={faFileImport}
                />
              </div>
            </div>
          </div>
          <div className= "col bg-primary right-panel">
            <h1> right</h1>
          </div>
      </div>
    </div>
  );
}

export default App;
