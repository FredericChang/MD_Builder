import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'
import useKeyPress from '../hooks/useKeyPress'

const FileSearch = ({ title,  onFileSearch }) => {
    const [ inputActive, setInputActive ] = useState(false)
    const [ value, setValue ] = useState('')
    const enterPressed = useKeyPress(13)
    const escPressed = useKeyPress(27)
    let node = useRef(null)
    let number = useRef(1)
    number.current++
    console.log(number.current) //number current 會變化 number則不會變化
    // const closeSearch = (e) =>{
    //     e.preventDefault()
    //     setInputActive(false)
    //     setValue('') 
    // }
    const closeSearch = () =>{
        setInputActive(false)
        setValue('') 
    }
    useEffect(() => {
        if (enterPressed && inputActive) {
          onFileSearch(value)
        }
        if(escPressed && inputActive) {
          closeSearch()
        }
      })
    useEffect(() => { //用途用於搜索點亮
        if (inputActive){
            node.current.focus()
        }
    }, [inputActive])

    return(
        <div className="alert alert-primary d-flex justify-content-between align-items-center mb-0" role="alert">
            {!inputActive &&
                <> 
                    <span>{title}</span> 
                    <button
                        type="button"
                        className="icon-button"
                        onClick ={ () => { setInputActive(true)}}
                    >
                        <FontAwesomeIcon 
                            title= "Search"
                            size="lg"
                            icon={ faSearch } 
                        />
                    </button>
                </>
            }
            {inputActive &&
                <> 
                    <input
                        className="form-control"
                        value={value}
                        ref = {node}
                        onChange={(e) => {setValue(e.target.value)}}
                    />
                    <button
                        type="button"
                        className="icon-button"
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
        </div>
    )
}
FileSearch.protoTypes = {
    title: PropTypes.string,
    onFileSearch: PropTypes.func.isRequired,
}
FileSearch.defaultProps = {
    title: 'Cloud Search'
}
export default FileSearch