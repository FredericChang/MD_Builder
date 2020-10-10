import React, { useState, useEffect, useRef } from 'react'

const FileSearch = ({ title, onFileSearch }) => {
    const [ inputActive, setInputActive ] = useState(false)
    const [ value, setValue ] = useState('')
    let number = useRef(1)
    number.current++
    console.log(number.current) //number current 會變化 number則不會變化
    let node = useRef(null)

    const closeSearch = (e) =>{
        e.preventDefault()
        setInputActive(false)
        setValue('') 
    }
    useEffect(() => {
        const handleInputEvent = (event) =>{
            const { keyCode } = event
            if (keyCode === 13 && inputActive ){
                onFileSearch(value)
            }else if (keyCode === 27 && inputActive ){
                closeSearch(event)
            }
        }
        document.addEventListener('keyup', handleInputEvent)
        return () =>{
            document.removeEventListener('keyup', handleInputEvent)
        }
    })
    useEffect(() => { //用途用於搜索點亮
        if (inputActive){
            node.current.focus()
        }
    }, [inputActive])

    return(
        <div class="alert alert-primary" role="alert">
            {!inputActive &&
                <div className="d-flex justify-content-between align-items-center"> 
                    <span>{title}</span> 
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick ={ () => { setInputActive(true)}}
                    >
                        Search
                    </button>
                </div>
            }
            {inputActive &&
                <div className="row"> 
                    <input
                        className="form-control col-8"
                        value={value}
                        ref = {node}
                        onChange={(e) => {setValue(e.target.value)}}
                    />
                    <button
                        type="button"
                        className="btn btn-primary col-4"
                        onClick ={closeSearch}
                    >
                        Close
                    </button>
                </div>
            }
        </div>
    )
}
export default FileSearch