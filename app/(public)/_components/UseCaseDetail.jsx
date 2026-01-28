import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PseoPageTemplate from "@/components/pseo/PseoPageTemplate";
const UseCaseDetail = ({ page }) => {
  if (!page) return null;

  return (
    <>
      <Navbar />
      <PseoPageTemplate page={page} />
      <Footer />
    </>
  );
};

export default UseCaseDetail;
