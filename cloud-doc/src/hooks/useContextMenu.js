import { useEffect, useRef } from 'react'

const { remote } = window.require('electron')
const { Menu, MenuItem } = remote

const useContextMenu = (itemArr, targetSelector) => {
    let clickedElement = useRef(null)
    useEffect(() => {
        const menu = new Menu()
        itemArr.forEach(item => {
            menu.append(new MenuItem(item))
        })
        const handleContextMenu = (e) => {
            // we only need to show the element with menu for Items
            // one DOM with oter DOM
            // to get external DOM
            // use this function to lock the pop menu
            if (document.querySelector(targetSelector).contains(e.target)){
                clickedElement.current = e.target
                menu.popup({window: remote.getCurrentWindow() })
            }
        }
        window.addEventListener('contextmenu',handleContextMenu)
        return () => {
            window.removeEventListener('contextmenu',handleContextMenu)
        }
    }, []) //卸載用
    return clickedElement // for return
}

export default useContextMenu