import { lazy } from "react";

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
];

export default routeList;
