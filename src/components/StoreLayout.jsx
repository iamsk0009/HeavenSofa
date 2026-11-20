import Navbar from './Navbar'
import Footer from './Footer'

export default function StoreLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="store-main min-h-[70svh] pt-28">{children}</main>
      <Footer />
    </>
  )
}
