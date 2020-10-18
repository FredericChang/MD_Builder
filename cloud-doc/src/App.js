import React , { useEffect, useState }from 'react';
import { faPlus, faFileImport } from '@fortawesome/free-solid-svg-icons'
import FileSearch from './components/FileSearch'
import SimpleMDE from "react-simplemde-editor";

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import "easymde/dist/easymde.min.css";
import FileList from './components/FileList'
import defaultFiles from './utils/defaultFiles'
import BottomBtn from './components/BottomBtn'
import TabList from './components/TabList'

function App() {
  const [ files, setFiles ] = useState(defaultFiles)
  const [ activeFileID, setActiveFileID ] = useState('')
  const [ openedFileIDs, setOpenedFileIDs ] = useState([])
  const [ unsavedFileIDs, setUnsavedFileIDs ] = useState([])
  const openedFiles = openedFileIDs.map(openID => {
    return files.find(file => file.id === openID)
  })

  const fileClick = (fileID) =>{
    setActiveFileID(fileID)
    if (!openedFileIDs.includes(fileID)){
      setOpenedFileIDs([ ...openedFileIDs, fileID])
    }
  }

  const tabClick = (fileID) => {
    setActiveFileID(fileID)
  }

  const tabClose = (id) => {
    const tabWithout = openedFileIDs.filter(fileID => fileID !== id)
    setOpenedFileIDs()
  }
  const activeFile = files.find(file => file.id ===activeFileID)
  return (
    <div className="App container-fluid px-0">
      <div className="row no-gutters">
          <div className= "col-3 bg-light left-panel">
            <FileSearch 
              title='Cloud Search'
            />
            <FileList
              files={files}
              // onFileClick={(id)=> {console.log(id)}}
              onFileClick={fileClick}
              onFileDelete={(id) => { console.log('delete', id)}}
              // onSaveEdit={(id, newValue) => {console.log(id); console.log(newValue)}}
            />
            <div className="row no-gutters button-group">
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
            { !activeFile &&
              <div className="start-page">
                please choose one or make a new Markdown
              </div>
            }
            { activeFile &&
              <>
                <TabList
                  files={openedFiles}
                  activeId={activeFileID}
                  unsaveIds={unsavedFileIDs}
                  onTabClick={tabClick}
                  onCloseTab={tabClose}
                />
                <SimpleMDE 
                  key={ activeFile && activeFile.id }
                  value={ activeFile && activeFile.body}
                  onChange={(value) => {console.log(value)}}
                  options={{
                    minHeight: '515px',
                  }}
                />
              </>
            }
          </div>
      </div>
    </div>
  );
}

export default App;
