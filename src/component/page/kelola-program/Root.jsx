import { useState } from "react";
import ProgramIndex from "./Index";
import ProgramAdd from "./AddProgram";

export default function Program() {
  const [pageMode, setPageMode] = useState("index");
  const [dataID, setDataID] = useState();

  function getPageMode() {
    switch (pageMode) {
      case "index":
        return <ProgramIndex onChangePage={handleSetPageMode} />;
      case "add":
        return <ProgramAdd onChangePage={handleSetPageMode} withID={dataID} />;
      // case "detailDraft":
      //   return (
      //     <KKDetailDraft onChangePage={handleSetPageMode} withID={dataID} />
      //   );
      // case "detailPublish":
      //   return (
      //     <KKDetailPublish onChangePage={handleSetPageMode} withID={dataID} />
      //   );
      // case "edit":
      //   return <KKEdit onChangePage={handleSetPageMode} withID={dataID} />;
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
