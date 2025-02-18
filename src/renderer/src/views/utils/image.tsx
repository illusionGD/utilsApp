import { routers } from '@renderer/router'
import { Card } from 'antd'
import Meta from 'antd/es/card/Meta'
import { Outlet, useLocation, useNavigate } from 'react-router'

type Props = {}

const Image = (props: Props) => {
    const nav = useNavigate()
    const location = useLocation()
    console.log('🚀 ~ location:', location)
    const imagePageList =
        routers
            .find((item) => item.path === '/utils')
            ?.children.find((child) => child.path === '/utils/image')?.children || []
    const ImageItemList = imagePageList?.map(({ path, name, description }, index) => {
        return (
            <Card hoverable style={{ width: 240 }} key={index} onClick={() => toPage(path)}>
                <Meta title={name} description={description} />
            </Card>
        )
    })
    function toPage(path?: string) {
        console.log('🚀 ~ path:', path)
        path && nav(path)
    }

    return <div>{location.pathname === '/utils/image' ? ImageItemList : <Outlet></Outlet>}</div>
}

export default Image
