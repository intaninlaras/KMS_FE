import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useState } from "react";

import Container from "./component/backbone/Container";
import Header from "./component/backbone/Header";
import SideBar from "./component/backbone/SideBar";

import Beranda from "./component/page/beranda/Root";

import MasterPelanggan from "./component/page/master-pelanggan/Root";
import MasterProduk from "./component/page/master-produk/Root";
import MasterProses from "./component/page/master-proses/Root";
import MasterKursProses from "./component/page/master-kurs-proses/Root";
import MasterAlatMesin from "./component/page/master-alat-mesin/Root";
import MasterOperator from "./component/page/master-operator/Root";
import MasterTest from "./component/page/master-test/Root";
import MasterTest_PostTest from "./component/page/master-test/PostTest";
import MasterTest_Test from "./component/page/master-test/Test";

export default function App() {
  const [showDefaultSidebar, setShowDefaultSidebar] = useState(true);
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Beranda />,
    },
    {
      path: "/master_pelanggan",
      element: <MasterPelanggan />,
    },
    {
      path: "/master_produk",
      element: <MasterProduk />,
    },
    {
      path: "/master_proses",
      element: <MasterProses />,
    },
    {
      path: "/master_kurs_proses",
      element: <MasterKursProses />,
    },
    {
      path: "/master_alat_mesin",
      element: <MasterAlatMesin />,
    },
    {
      path: "/master_operator",
      element: <MasterOperator />,
    },
    {
      path: "/master_test",
      element: <MasterTest />,
    },
    {
      path: "/master_test/post-test",
      element: <MasterTest_PostTest />,
    },
    {
      path: "/master_test/soal-postTest",
      element: <MasterTest_Test />,
    }
  ]);

  return (
    <>
      <Header />
      <div style={{ marginTop: "70px" }}></div>
      <div className="d-flex flex-row">
        {<SideBar />} 
        <Container>
          <RouterProvider router={router} />
        </Container>
      </div>
    </>
  );
}
