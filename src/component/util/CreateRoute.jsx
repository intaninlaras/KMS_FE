import { lazy } from "react";
import MasterDaftarPustaka from "../page/daftar-pustaka/Root";
import PengajuanKKs from "../page/pengajuan_kk/Root";

const Beranda = lazy(() => import("../page/beranda/Root"));
const KelolaKK = lazy(() => import("../page/kelola-kelompok-keahlian/Root"));
const AnggotaKK = lazy(() => import("../page/anggota-kelompok-keahlian/Root"));
const Program = lazy(() => import("../page/kelola-program/Root"));

const routeList = [
  {
    path: "/",
    element: <Beranda />,
  },
  {
    path: "/kelompok_keahlian",
    element: <KelolaKK />,
  },
  {
    path: "/anggota_kelompok_keahlian",
    element: <AnggotaKK />,
  },
  {
    path: "/daftar_pustaka",
    element: <MasterDaftarPustaka />,
  },
  {
    path: "/kelola_program",
    element: <Program />,
  },
  {
    path: "/pengajuan_kk",
    element: <PengajuanKKs />,
  },
];

export default routeList;
