import { routers } from '@renderer/router'
import { Card, Select } from 'antd'
import Meta from 'antd/es/card/Meta'
import { useNavigate } from 'react-router'
type Props = {}

function Index({}: Props) {

    const nav = useNavigate()
    function toPage(path: string) {
        if (!path) {
            return
        }
        nav(path)
    }

    function initCardList() {
        return routers
            .filter((item) => item.path !== '/')
            .map(({ name, path, description }) => {
                return (
                    <>
                        <Card hoverable style={{ width: 240 }} onClick={() => toPage(path)}>
                            <Meta title={name} description={description} />
                        </Card>
                    </>
                )
            })
    }

    return (
        <div className="">
            <div className="flex-column-center">{initCardList()}</div>
        </div>
    )
}

export default Index
