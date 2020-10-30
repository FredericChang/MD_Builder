import React , { useEffect, useState }from 'react'


import { faPlus, faFileImport, faSave } from '@fortawesome/free-solid-svg-icons'
import FileSearch from './components/FileSearch'
import SimpleMDE from "react-simplemde-editor";
import uuidv4 from 'uuid/dist/v4'

import { flattenArr, objToArr} from './utils/helper'
import fileHelper from './utils/fileHelper'

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import "easymde/dist/easymde.min.css";
import FileList from './components/FileList'
// import defaultFiles from './utils/defaultFiles'
import BottomBtn from './components/BottomBtn'
import TabList from './components/TabList'


const { app } = window.require('electron').remote
const { remote } = window.require('electron')
const { join, basename, extname, dirname } = window.require('path')
const Store = window.require('electron-store')
const fileStore = new Store({'name': 'Files Data'})


// store.set('name', 'Frederic')
// console.log(store.get('name'))
// store.delete('name')
// console.log(store.get('name'))

const saveFilesToStore = (files) => {
  //we don't have to store everything item into file system
  const filesStoreObj = objToArr(files).reduce((result, file) => {
    const {id, path, title, createdAt } = file
    result[id] = {
      id,
      path,
      title,
      createdAt,
    }
    return result
  }, {})
  fileStore.set('files', filesStoreObj)
}

function App() {
  const [ files, setFiles ] = useState(fileStore.get('files') || {})
  // console.log(files)
  const [ activeFileID, setActiveFileID ] = useState('')
  const [ openedFileIDs, setOpenedFileIDs ] = useState([])
  const [ unsavedFileIDs, setUnsavedFileIDs ] = useState([])
  const [ searchedFiles, setSearchedFiles ] = useState([])
  const [ duplicateIDs, setDuplicateID] = useState(false)


  const filesArr = objToArr(files)
  // console.log(filesArr)
  const savedLocation = app.getPath('documents')

  // const savedLocation = 'D:\\WebstormProjects\\MD_Builder\\cloud-doc'
  const activeFile = files[activeFileID]
  console.log("activeFile");
  const openedFiles = openedFileIDs.map(openID => {
    return files[openID]
  })
  const fileListArr = (searchedFiles.length > 0 ) ? searchedFiles : filesArr
  // const openedFiles = openedFileIDs.map(openID => {
  //   return files.find(file => file.id === openID)
  // })

  const fileClick = (fileID) =>{
    setActiveFileID(fileID)
    const currentFile = files[fileID]
    console.log(currentFile);
    if (currentFile.isLoaded) {
      fileHelper.readFile(currentFile.path).then(value => {
        const newFile = { ...files[fileID], body: value , isLoaded : true}
        setFiles({...files, [fileID]: newFile })
      })
    }
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
    // console.log('object', id)
    if (files[id].isNew){
      const { [id]:value, ...afterDelete } = files
      setFiles(afterDelete)
      // setFiles({...files })//rerender
    } else {
      fileHelper.deleteFile(files[id].path).then(() => {
        const { [id]:value, ...afterDelete } = files
        setFiles(afterDelete)
        saveFilesToStore(afterDelete)
        tabClose(id)
      })
    }
  }

  const updatedFileName = (id, title, isNew) => {
    // const newFiles = files.map(file => {
    //   if (file.id === id) {
    //     file.title = title
    //     file.isNew = false // if you didn't add this line, the status will keep staying on edit box

    const newPath = isNew ? join(savedLocation, `${title}.md`)
    : join(dirname(files[id].path),  `${title}.md` )
    const modifiedFile = { ... files[id], title, isNew: false, path: newPath}
    const newFiles = { ...files, [id]: modifiedFile }
    // setFiles({ ...files, [id]: modifiedFile})
    if (isNew) {
      fileHelper.writeFile(newPath, files[id].body).then(() => {
        setFiles(newFiles)
        saveFilesToStore(newFiles)
      })
    } else {
      const oldPath = files[id].path
      fileHelper.renameFile(oldPath, newPath).then(() => {
        setFiles(newFiles)
        saveFilesToStore(newFiles)
      })
    }
    
  }

  const fileSearch = (keyword) => {
    const newFiles = filesArr.filter(file => file.title.includes(keyword))
    setSearchedFiles(newFiles)
  }

  const nameSearch = (title) => {
    const newFiles = filesArr.filter(file => {
      if (file.title === title){
          console.log(file.title, title, "match")
          return false
      } else {
        return true
      }
    })
    console.log(newFiles(),"nameR");
  }

// const nameSearch2 = (title) => {
//   if( filesArr.find(file => file.title === title)){
//     console.log("match")
//     return duplicate(false)
//   } else {
//     console.log("not match")
//     return duplicate(true)
//   }
// }
  
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
  const saveCurrentFile = () => {
    // fileHelper.writeFile(join(savedLocation, `${activeFile.title}.md`),
    fileHelper.writeFile(activeFile.path,
      activeFile.body
      ).then(() => {
        setUnsavedFileIDs(unsavedFileIDs.filter(id => id !== activeFile.id))
      })
  }
  
  const importFiles =() => {
    remote.dialog.showOpenDialog({
      title: 'choose MD File',
      properties: ['openFile', 'multiSelections'],
      filters: [
        {name: 'Markdown files', extensions: ['md']}
      ]
    }).then(result => {
      // console.log(result.canceled)
      // console.log(result.filePaths)
      const paths = result.filePaths
      if (Array.isArray(paths)) {
        //fileter out the path we already have in our database
        const filteredPaths = paths.filter(path => {
          const alredyAdded = Object.values(files).find( file => {
            return file.path === path
          })
          return !alredyAdded
        })
        
        const importFilesArr = filteredPaths.map(path => {
          return {
            id : uuidv4(),
            title : basename(path, extname(path)),
            path,
          }
        })
        console.log(importFilesArr);
        // get the new files object in flattenArr
        const newFiles = { ...files, ...flattenArr(importFilesArr)}
        // console.log(newFiles);
        setFiles(newFiles)
        saveFilesToStore(newFiles)
        if (importFilesArr.length > 0) {
          remote.dialog.showMessageBox({
            type: 'info',
            title: `import Ok${importFilesArr.length}`,
            message :  `import Ok${importFilesArr.length}`,
          })
        }
      }
    })
    // }, (paths) => { //return functions
    //   console.log(paths);
    // })

  }
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
                  onBtnClick={importFiles}
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
                <BottomBtn 
                  text="Export" 
                  colorClass="btn-primary" 
                  icon={faSave}
                  onBtnClick = {saveCurrentFile}
                />
              </>
            }
          </div>
      </div>
    </div>
  );
}

export default App;
