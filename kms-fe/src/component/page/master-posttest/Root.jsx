import { useState } from "react";
import MasterPostTestIndex from "./Index";
import MasterPostTestAdd from "./Add";
import MasterPostTestDetail from "./Detail";
import MasterPostTestEdit from "./Edit";

export default function MasterPostTest() {
  const [pageMode, setPageMode] = useState("index");
  const [dataID, setDataID] = useState();

  function getPageMode() {
    switch (pageMode) {
      case "index":
        return <MasterPostTestIndex onChangePage={handleSetPageMode} />;
      case "add":
        return <MasterPostTestAdd onChangePage={handleSetPageMode} />;
      case "detail":
        return (
          <MasterPostTestDetail
            onChangePage={handleSetPageMode}
            withID={dataID}
          />
        );
      case "edit":
        return (
          <MasterPostTestEdit onChangePage={handleSetPageMode} withID={dataID} />
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
