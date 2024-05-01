import { useState } from "react";
import MasterTestIndex from "./Index";
import MasterTestAdd from "./Add";
import MasterTestDetail from "./Detail";
import MasterTestEdit from "./Edit";

export default function MasterTest() {
  const [pageMode, setPageMode] = useState("index");
  const [dataID, setDataID] = useState();

  function getPageMode() {
    switch (pageMode) {
      case "index":
        return <MasterTestIndex onChangePage={handleSetPageMode} />;
      case "add":
        return <MasterTestAdd onChangePage={handleSetPageMode} />;
      case "detail":
        return (
          <MasterTestDetail
            onChangePage={handleSetPageMode}
            withID={dataID}
          />
        );
      case "edit":
        return (
          <MasterTestEdit
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
