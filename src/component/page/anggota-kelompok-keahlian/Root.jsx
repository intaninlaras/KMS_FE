import { useState } from "react";
import AnggotaKKIndex from "./Index";
import AnggotaDetail from "./Show";

export default function AnggotaKelompokKeahlian() {
  const [pageMode, setPageMode] = useState("index");
  const [dataID, setDataID] = useState();

  function getPageMode() {
    switch (pageMode) {
      case "index":
        return <AnggotaKKIndex onChangePage={handleSetPageMode} />;
      case "show":
        return (
          <AnggotaDetail onChangePage={handleSetPageMode} withID={dataID} />
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
