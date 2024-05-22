import { useState } from "react";
import KKIndex from "./Index";
import KKAdd from "./Add";
import KKEdit from "./Edit";
import KKDetailDraft from "./DetailDraft";
import KKDetailPublish from "./DetailPublish";

export default function KelompokKeahlian() {
  const [pageMode, setPageMode] = useState("index");
  const [dataID, setDataID] = useState();

  function getPageMode() {
    switch (pageMode) {
      case "index":
        return <KKIndex onChangePage={handleSetPageMode} />;
      case "add":
        return <KKAdd onChangePage={handleSetPageMode} />;
      case "detailDraft":
        return (
          <KKDetailDraft onChangePage={handleSetPageMode} withID={dataID} />
        );
      case "detailPublish":
        return (
          <KKDetailPublish onChangePage={handleSetPageMode} withID={dataID} />
        );
      case "edit":
        return <KKEdit onChangePage={handleSetPageMode} withID={dataID} />;
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
