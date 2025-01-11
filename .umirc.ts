import { defineConfig } from "umi";
import { Platform, Arch } from "@umijs/plugin-electron";
export default defineConfig({
  npmClient: "pnpm",
  plugins: [
    "@umijs/plugin-electron",
    "@umijs/plugins/dist/antd",
    "@umijs/plugins/dist/tailwindcss",
  ],
  electron: {
    // 打包配置
    builder: {
      targets: Platform.WINDOWS.createTarget(["nsis"], Arch.x64),
      config: {
        nsis: {
          oneClick: false, // 是否一键安装
          allowElevation: true, // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
          allowToChangeInstallationDirectory: true, // 允许修改安装目录
          // installerIcon: './build/icons/aaa.ico', // 安装图标
          // uninstallerIcon: './build/icons/bbb.ico', //卸载图标
          // installerHeaderIcon: './build/icons/aaa.ico', // 安装时头部图标
          // createDesktopShortcut: true, // 创建桌面图标
          // createStartMenuShortcut: true, // 创建开始菜单图标
          // shortcutName: 'xxxx', // 图标名称
          // include: 'build/script/installer.nsh', // 包含的自定义nsis脚本 这个对于构建需求严格得安装过程相当有用。
          // script: 'build/script/installer.nsh', // NSIS脚本的路径，用于自定义安装程序。 默认为build / installer.nsi
        },
      },
    },
  },
  antd: {
    configProvider: {
      components: {
        Menu: {
          iconSize: 20,
          collapsedIconSize: 25,
        },
      },
    },
    dark: false,
    compact: true,
  },
  tailwindcss: {},
});
