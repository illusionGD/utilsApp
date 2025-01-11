import logo from '@/assets/logo.png'
export default function HomePage() {
    return (
        <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center justify-center">
                <img src={logo} alt="logo" />
                <p className="mt-10">
                    前端开发工具app，集成常用功能，如：压缩图片，转json等功能
                </p>
            </div>
        </div>
    )
}
