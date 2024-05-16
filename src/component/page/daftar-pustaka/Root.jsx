import { useState } from "react";
import MasterDaftarPustakaIndex from "./Index";
import MasterDaftarPustakaDetail from "./Detail";
import MasterDaftarPustakaAdd from "./Add";
import MasterDaftarPustakaEdit from "./Edit";

export default function MasterDaftarPustaka() {
  const [pageMode, setPageMode] = useState("index");
  const [dataID, setDataID] = useState();

  function getPageMode() {
    switch (pageMode) {
      case "indexKK":
        return <KelolaPustakaIndex onChangePage={handleSetPageMode} />;
      case "add":
        return (
          <MasterDaftarPustakaAdd
            onChangePage={handleSetPageMode}
            withID={dataID}
          />
        );
      case "edit":
        return (
        <MasterDaftarPustakaEdit 
        onChangePage={handleSetPageMode} 
        withID={dataID}
        />
        );
      case "add":
        return <MasterDaftarPustakaAdd onChangePage={handleSetPageMode} />;
      case "index":
        return (
          <MasterDaftarPustakaIndex
            onChangePage={handleSetPageMode}
            withID={dataID}
          />
        );
      case "detail":
        return (
          <MasterDaftarPustakaDetail
            onChangePage={handleSetPageMode}
            withID={dataID}
          />
        );
      default:
        return (
          "Tidak ditemukan"
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
