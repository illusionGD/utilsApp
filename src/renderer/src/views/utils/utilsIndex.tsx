import UtilsMenu from '@renderer/components/UtilsMenu'
import { Outlet } from 'react-router'

type Props = {}

const UtilsIndex = (props: Props) => {
  return (
    <div style={{
        display: 'flex'
    }}>
        <UtilsMenu></UtilsMenu>
        <div style={
            {
                padding: '10px',
                width: '100%'
            }
        }>
            <Outlet></Outlet>
        </div>
    </div>
  )
}

export default UtilsIndex