import { useState } from "react";
import KonfirmIndex from "./Index";
import KonfirmDetail from "./Detail";

export default function KonfirmasiAnggota() {
  const [pageMode, setPageMode] = useState("index");
  const [dataID, setDataID] = useState();

  function getPageMode() {
    switch (pageMode) {
      case "index":
        return <KonfirmIndex onChangePage={handleSetPageMode} />;
      case "detail":
        return (
          <KonfirmDetail onChangePage={handleSetPageMode} withID={dataID} />
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
