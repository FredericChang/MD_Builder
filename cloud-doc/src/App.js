import React from 'react';
import { faPlus, faFileImport } from '@fortawesome/free-solid-svg-icons'
import FileSearch from './components/FileSearch'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import FileList from './components/FileList'
import defaultFiles from './utils/defaultFiles'
import BottomBtn from './components/BottomBtn'
import TabList from './components/TabList'

function App() {
  return (
    <div className="App container-fluid px-0">
      <div className="row">
          <div className= "col-3 left-panel">
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
          <div className= "col-9 right-panel">
            <TabList
              files={defaultFiles}
              activeId="1"
              onTabClick={(id) => {console.log(id)}}
              onCloseTab={(id) => {console.log('closong',id)}}
            />
          </div>
      </div>
    </div>
  );
}

export default App;
