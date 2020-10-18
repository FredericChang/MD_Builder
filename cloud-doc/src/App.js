import React , { useEffect, useState }from 'react';
import { faPlus, faFileImport } from '@fortawesome/free-solid-svg-icons'
import FileSearch from './components/FileSearch'
import SimpleMDE from "react-simplemde-editor";
import uuidv4 from 'uuid/dist/v4'

import { flattenArr, objToArr} from './utils/helper'


import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import "easymde/dist/easymde.min.css";
import FileList from './components/FileList'
import defaultFiles from './utils/defaultFiles'
import BottomBtn from './components/BottomBtn'
import TabList from './components/TabList'

function App() {
  const [ files, setFiles ] = useState(flattenArr(defaultFiles))
  console.log(files)
  const [ activeFileID, setActiveFileID ] = useState('')
  const [ openedFileIDs, setOpenedFileIDs ] = useState([])
  const [ unsavedFileIDs, setUnsavedFileIDs ] = useState([])
  const [ searchedFiles, setSearchedFiles ] = useState([])
  const filesArr = objToArr(files)
  console.log(filesArr)

  const activeFile = files[activeFileID]
  const openedFiles = openedFileIDs.map(openID => {
    return files[openID]
  })
  const fileListArr = (searchedFiles.length > 0 ) ? searchedFiles : filesArr
  // const openedFiles = openedFileIDs.map(openID => {
  //   return files.find(file => file.id === openID)
  // })

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
    const tabsWithout = openedFileIDs.filter(fileID => fileID !== id)
    setOpenedFileIDs(tabsWithout)
    if (tabsWithout.length > 0){
      setActiveFileID(tabsWithout[0])
    }else {
      setActiveFileID('')
    }
  }

  const fileChange = (id, value) => {
    // const newFiles = files.map(file => {
    //   if (file.id === id){
    //     file.body = value
    //   }
    //   return file
    // })
    const newFile = { ... files[id], body: value}
    setFiles({ ...files, [id]: newFile })
    // setFiles({})
    // setFiles(newFiles)
    // updated newSavedID
    if (!unsavedFileIDs.includes(id)){
      setUnsavedFileIDs([ ... unsavedFileIDs, id])
    }
  }

  const deleteFile = (id) => {
    // const newFiles = files.filter(file => file.id !== id)
    console.log('object', id)
    delete files[id]
    setFiles(files)
    // setFiles(newFiles)
    tabClose(id)
  }

  const updatedFileName = (id, title) => {
    // const newFiles = files.map(file => {
    //   if (file.id === id) {
    //     file.title = title
    //     file.isNew = false // if you didn't add this line, the status will keep staying on edit box
    //   }
    //   return file
    // })
    const modifiedFile = { ... files[id], title, isNew: false}
    setFiles({ ...files, [id]: modifiedFile})
  }

  const fileSearch = (keyword) => {
    const newFiles = filesArr.filter(file => file.title.includes(keyword))
    setSearchedFiles(newFiles)
  }
  
  const createNewFile = () => {
    const newID = uuidv4()
    // const newFiles = [
    //   ...files,
    //   {
    //     id: newID,
    //     title: '',
    //     body: '##please enter markdown',
    //     createAt: new Date().getTime(),
    //     isNew: true,
    //   }
    // ]
    const newFile = {
      id: newID,
      title: '',
      body: '##please enter markdown',
      createAt: new Date().getTime(),
      isNew: true,
    }
    setFiles({ ...files, [newID]: newFile })
  }
  // const activeFile = files.find(file => file.id ===activeFileID)

  // const fileListArr = (searchedFiles.length > 0 ) ? searchedFiles : files

  
  return (
    <div className="App container-fluid px-0">
      <div className="row no-gutters">
          <div className= "col-3 bg-light left-panel">
            <FileSearch 
              title='Cloud Search'
              onFileSearch={fileSearch}
            />
            <FileList
              files={fileListArr}
              // onFileClick={(id)=> {console.log(id)}}
              onFileClick={fileClick}
              onFileDelete={deleteFile}
              onSaveEdit={updatedFileName}
            />
            <div className="row no-gutters button-group">
              <div className="col"> 
                <BottomBtn 
                  text="New" 
                  colorClass="btn-primary" 
                  icon={faPlus}
                  onBtnClick = {createNewFile}
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
                  onChange={(value) => {fileChange(activeFile.id, value)}}
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
