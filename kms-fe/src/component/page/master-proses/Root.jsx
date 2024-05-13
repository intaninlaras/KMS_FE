import { useState } from "react";
import MasterProsesIndex from "./Index";
import MasterProsesAdd from "./Add";
import MasterProsesDetail from "./Detail";
import MasterProsesEdit from "./Edit";
import PilihKelompokKeahlian from "./Kelompok_Keahlian";
import MasterPostTestAdd from "../master-produk/Add";
import SharingExpert from "./Sharing";

export default function MasterProses() {
  const [pageMode, setPageMode] = useState("kk");
  const [dataID, setDataID] = useState();

  function getPageMode() {
    switch (pageMode) {
      case "index":
        return <MasterProsesIndex onChangePage={handleSetPageMode} />;
      case "add":
        return <MasterProsesAdd onChangePage={handleSetPageMode} />;
      case "kk":
        return <PilihKelompokKeahlian onChangePage={handleSetPageMode} />;
      case "posttest":
        return <MasterPostTestAdd onChangePage={handleSetPageMode} />;
        case "sharingexpert":
          return <SharingExpert onChangePage={handleSetPageMode} />;
      case "detail":
        return (
          <MasterProsesDetail onChangePage={handleSetPageMode} withID={dataID}/>
        );
      case "edit":
        return (
          <MasterProsesEdit onChangePage={handleSetPageMode} withID={dataID} />
        );
    }
  }

  function handleSetPageMode(mode) {
    setPageMode(mode);
  }

  function handleSetPageMode(mode, withID) {
    setDataID(withID);
    setPageMode(mode);
  }

  return <div>{getPageMode()}</div>;
}
