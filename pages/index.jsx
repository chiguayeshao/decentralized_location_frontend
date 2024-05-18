import Head from "next/head"
import styles from "../styles/Home.module.css"
import DrawerCard from "@/components/DrawerCard"
import dynamic from "next/dynamic"

// 使用 dynamic 导入 Google 地图组件，以确保只在客户端加载
const Map = dynamic(() => import("../components/Map"), {
  loading: () => <p>Loading Map.....</p>,
  ssr: false // 禁止在服务器端渲染
})

const Home = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>My Google Map</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className="w-full h-[600px]">
          <Map />
        </div>
        {/* 右侧抽屉 */}
        <DrawerCard />
      </main>
    </div>
  )
}

export default Home
