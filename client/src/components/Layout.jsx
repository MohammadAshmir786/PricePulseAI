import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import PropTypes from "prop-types";
import ThreeBackground from "./three/ThreeParticlesBackground.jsx";
import SupportChat from "./SupportChat.jsx";

export default function Layout({ children }) {
  return (
    <div
      className="min-h-screen relative"
      style={{ background: "var(--page-bg)", color: "var(--text)" }}
    >
      {/* Global background layer (dark: particles, light: soft gradient + blobs) */}
      <ThreeBackground />
      <Navbar />
      <main className="w-full relative">{children}</main>
      <Footer />
      <SupportChat />
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};
