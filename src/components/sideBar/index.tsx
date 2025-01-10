import React from 'react'
import './index.scss'
type Props = {}

function SideBar({}: Props) {
    return (
        <div className="side-bar flex-center-col">
            <ul className="side-bar-list flex-center-col">
                <li className="side-item">test</li>
            </ul>
        </div>
    )
}

export default SideBar
