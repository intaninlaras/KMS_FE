import React from 'react';
import { createBrowserRouter, RouterProvider, BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Container from "./component/backbone/Container";
import Header from "./component/backbone/Header";
import SideBar from "./component/backbone/SideBar";
import Show_SideBar from "./component/backbone/Show_SideBar";

import Beranda from "./component/page/beranda/Root";
import MasterPelanggan from "./component/page/master-pelanggan/Root";
import MasterProduk from "./component/page/master-produk/Root";
import MasterProses from "./component/page/master-proses/Root";
import MasterKursProses from "./component/page/master-kurs-proses/Root";
import MasterAlatMesin from "./component/page/master-alat-mesin/Root";
import MasterOperator from "./component/page/master-operator/Root";
import MasterTest from "./component/page/master-test/Root";
import MasterPostTest from "./component/page/master-posttest/Root";
import MasterTest_PreTest from "./component/page/master-test/PreTest";
import MasterTest_PostTest from "./component/page/master-test/PostTest";
import MasterTest_Test from "./component/page/master-test/Test";
import MasterTest_HasilTest from "./component/page/master-test/HasilTest";
import MasterTest_DetailTest from "./component/page/master-test/DetailTest";
import MasterTest_Materi from "./component/page/master-test/Materi";
import MasterTest_MateriPDF from "./component/page/master-test/MateriPDF";
import MasterTest_MateriVideo from "./component/page/master-test/MateriVideo";
import MasterTest_Forum from "./component/page/master-test/Forum";

export default function App() {
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
    },
    {
      path: "/master_test/soal-preTest",
      element: <MasterTest_HasilTest />,
    },
    {
      path: "/master_posttest",
      element: <MasterPostTest />,
    },
    {
      path: "/pretest",
      element: <MasterTest_PreTest />,
    },
    {
      path: "/soal_pretest",
      element: <MasterTest_Test />,
    },
    {
      path: "/hasil_test",
      element: <MasterTest_HasilTest />,
    },
    {
      path: "/detail_test",
      element: <MasterTest_DetailTest />,
    },
    {
      path: "/master_test/sub_materi1",
      element: <MasterTest_Materi />,
    },
    {
      path: "/sharing_expert/materi_pdf",
      element: <MasterTest_MateriPDF />,
    },
    {
      path: "/sharing_expert/materi_video",
      element: <MasterTest_MateriVideo />,
    },
    {
      path: "/master_test/forum",
      element: <MasterTest_Forum />,
    }
  ]);

  return (
    <>
      <Header />
      <div style={{ marginTop: '70px' }}></div>
      <div className="d-flex flex-row">
        <SideBar />
        <Container>
          <RouterProvider router={router} />
        </Container>
      </div>
    </>
  );
}
