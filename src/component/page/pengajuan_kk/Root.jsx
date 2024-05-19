import { useState } from "react";
import PengajuanIndex from "./Index";
import PengajuanAdd from "./Add";
import PengajuanDetail from "./Detail";

export default function PengajuanKKs() {
  const [pageMode, setPageMode] = useState("index");
  const [dataID, setDataID] = useState();

  function getPageMode() {
    switch (pageMode) {
      case "index":
        return <PengajuanIndex onChangePage={handleSetPageMode} />;
      case "add":
        return (
          <
            PengajuanAdd
            onChangePage={handleSetPageMode}
            withID={dataID}
          />
        );
      case "detail":
        return (
          <
            PengajuanDetail
            onChangePage={handleSetPageMode}
            withID={dataID} 
            />
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
