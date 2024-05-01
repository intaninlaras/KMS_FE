import { useState } from "react";
import MasterTestIndex from "./PostTest";
import MasterTestIndex2 from "./PreTest";
import PengerjaanTest from "./Test";
import MasterTest_Soal from "./Soal";

export default function MasterTest() {
  const [pageMode, setPageMode] = useState("index");
  const [dataID, setDataID] = useState();

  function getPageMode() {
    switch (pageMode) {
      case "index":
        return <MasterTestIndex onChangePage={handleSetPageMode} />;
        case "soal_pretest":
          return <MasterTest_Soal onChangePage={handleSetPageMode} />;
        case "index2":
        return <MasterTestIndex2 onChangePage={handleSetPageMode} />;
      case "test":
        return <PengerjaanTest onChangePage={handleSetPageMode} />;
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
