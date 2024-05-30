import { useState } from "react";
import MasterProsesIndex from "./Index";
import MasterPreTestAdd from "./PreTestAdd";
import MasterCourseAdd from "./CourseAdd";
import MasterCourseEdit from "./CourseEdit";
import MasterCourseDetail from "./CourseDetail";
import MasterForumAdd from "./ForumAdd";
import MasterPostTestAdd from "./PostTestAdd";
import MasterSharingAdd from "./SharingAdd";
import PilihKelompokKeahlian from "./Kelompok_Keahlian";

export default function MasterProses() {
  const [pageMode, setPageMode] = useState("kk");
  const [dataID, setDataID] = useState();

  function getPageMode() {
    switch (pageMode) {
      case "index":
        return <MasterProsesIndex onChangePage={handleSetPageMode} withID={dataID}/>;
      case "pretestAdd":
        return <MasterPreTestAdd onChangePage={handleSetPageMode} />;
      case "courseAdd":
        return <MasterCourseAdd onChangePage={handleSetPageMode} />;
      case "courseEdit":
        return <MasterCourseEdit onChangePage={handleSetPageMode}             withID={dataID}
        />;
        case "courseDetail":
        return <MasterCourseDetail onChangePage={handleSetPageMode}             withID={dataID}
        />;
      case "forumAdd":
        return <MasterForumAdd onChangePage={handleSetPageMode} />;
      case "posttestAdd":
        return <MasterPostTestAdd onChangePage={handleSetPageMode} />;
      case "sharingAdd":
          return <MasterSharingAdd onChangePage={handleSetPageMode} />;
      case "kk":
        return <PilihKelompokKeahlian onChangePage={handleSetPageMode} />;
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
