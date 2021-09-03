import Layout from "../components/Layout"

export default function Custom404() {
  return (
    <Layout>
      <div className="p-10">
        <div className="text-4xl font-black text-center lg:text-9xl text-company">
          404
        </div>
        <div className="text-xl font-black text-center text-gray-800 lg:text-3xl">
          We couldn't find this page
        </div>
      </div>
    </Layout>
  )
}
