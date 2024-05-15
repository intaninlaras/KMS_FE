import { lazy } from "react";
import MasterDaftarPustaka from "../page/daftar-pustaka/Root";

const Beranda = lazy(() => import("../page/beranda/Root"));
const KelolaKK = lazy(() => import("../page/kelola-kelompok-keahlian/Root"));
const AnggotaKK = lazy(() => import("../page/anggota-kelompok-keahlian/Root"));

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
];

export default routeList;
