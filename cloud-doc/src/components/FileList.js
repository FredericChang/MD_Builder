import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons'
import { faMarkdown } from '@fortawesome/free-brands-svg-icons'
import PropTypes from 'prop-types'


const FileList = ( {files, onFileClick, onSaveEdit, onFileDelete }) =>{
    const [ editStatus , setEditStatus ] = useState(false)
    const [ value, setValue ] = useState('')
    let node = useRef(null)
    const closeSearch = (e) =>{
        e.preventDefault()
        setEditStatus(false)
        setValue('') 
    }
    useEffect(() => {
        const handleInputEvent = (event) =>{
            const { keyCode } = event
            if (keyCode === 13 && setEditStatus ){
                const editItem = files.find(file => file.id === editStatus)
                onSaveEdit(editItem.id, value)
                setEditStatus(false)
                setValue('')
            }else if (keyCode === 27 && setEditStatus ){
                closeSearch(event)
            }
        }
        document.addEventListener('keyup', handleInputEvent)
        return () =>{
            document.removeEventListener('keyup', handleInputEvent)
        }
    })
    return( 
        <ul className= "list-group list-group-flush file-list">
        {
            files.map(file => (
                <li
                    className="list-group-item bg-light d-flex row align-items-center file-item "
                    key={file.id}
                >
                    { (file.id !== editStatus) &&
                    <>
                        <span className ="col-2">
                            <FontAwesomeIcon 
                                title= "Search"
                                size="lg"
                                icon={ faMarkdown } 
                            />
                        </span>
                        <span 
                            className="col-8 c-link"
                            onClick={()=> {onFileClick(file.id)}}
                        >
                                {file.title}
                        </span>
                        <button
                            type="button"
                            className="icon-button col-1"
                            onClick ={()=>{ setEditStatus(file.id); setValue(file.title); }}
                        >
                            <FontAwesomeIcon 
                                title= "Edit"
                                size="lg"
                                icon={ faEdit } 
                            />
                        </button>
                        <button
                            type="button"
                            className="icon-button col-1"
                            onClick={()=> {onFileDelete(file.id)}}
                        >
                            <FontAwesomeIcon 
                                title= "Delete"
                                size="lg"
                                icon={ faTrash } 
                            />
                        </button>
                    </>
                    }
                    { (file.id === editStatus) &&
                        <> 
                          <input
                              className="form-control col-10"
                              value={value}
                              ref={node}
                              onChange={(e) => {setValue(e.target.value)}}
                          />
                          <button
                              type="button"
                              className="icon-button col-2"
                              onClick ={closeSearch}
                          >
                              <FontAwesomeIcon 
                                  title= "Close"
                                  size="lg"
                                  icon={ faTimes } 
                              />
                          </button>
                        </>
                    }
                </li>
            ))
        }
        </ul>
    )

}
FileList.prototype = {
    files: PropTypes.array,
    onFileClick: PropTypes.func,
    onFileDelete: PropTypes.func,
    onSaveEdit: PropTypes.func,
}
export default FileList


