import SideBar from '@/components/sideBar'
import { Outlet } from 'umi'
import styles from './index.scss'
import '../assets/css/global.scss'

export default function Layout() {
    return (
        <div className={styles.layout}>
            <SideBar></SideBar>
            <Outlet></Outlet>
        </div>
    )
}
