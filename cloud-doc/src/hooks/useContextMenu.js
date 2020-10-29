import { useEffect, useRef } from 'react'

const { remote } = window.require('electron')
const { Menu, MenuItem } = remote

const useContextMenu = (itemArr) => {
    let clickedElement = useRef(null)
    useEffect(() => {
        const menu = new Menu()
        itemArr.forEach(item => {
            menu.append(new MenuItem(item))
        })
        const handleContextMenu = (e) => {
            clickedElement.current = e.target
            menu.popup({window: remote.getCurrentWindow() })
        }
        window.addEventListener('contextmenu',handleContextMenu)
        return () => {
            window.removeEventListener('contextmenu',handleContextMenu)
        }
    }, []) //卸載用
    return clickedElement // for return
}

export default useContextMenu