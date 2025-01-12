import SideBar from '@/components/SideBar'
import { Outlet } from 'umi'
import TopBreadcrumb from '@/components/TopBreadcrumb'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { useState } from 'react'

export default function Layout() {
    const [collapsed, setCollapsed] = useState(false)
    const toggleCollapsed = () => {
        setCollapsed(!collapsed)
    }
    return (
        <div className="flex">
            <SideBar collapsed={collapsed}></SideBar>
            <div className="px-2 w-full">
                <div className="flex items-center border-b-2">
                    <span onClick={toggleCollapsed}>
                        {collapsed ? (
                            <MenuUnfoldOutlined className="pr-2 cursor-pointer" />
                        ) : (
                            <MenuFoldOutlined className="pr-2 cursor-pointer" />
                        )}
                    </span>
                    <TopBreadcrumb></TopBreadcrumb>
                </div>
                <div
                    className="overflow-auto h-full py-2"
                    style={{
                        height: 'calc(100vh - 50px)',
                    }}
                >
                    <Outlet></Outlet>
                </div>
            </div>
        </div>
    )
}
