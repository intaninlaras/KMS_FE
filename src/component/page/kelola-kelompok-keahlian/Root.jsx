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

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import KKIndex from "./Index";
// import KKAdd from "./Add";
// import KKEdit from "./Edit";
// import KKDetailDraft from "./DetailDraft";
// import KKDetailPublish from "./DetailPublish";

// export default function KelompokKeahlian() {
//   const [pageMode, setPageMode] = useState("index");
//   const [dataID, setDataID] = useState();
//   const navigate = useNavigate(); // Initialize useNavigate instead of useHistory

//   function getPageMode() {
//     switch (pageMode) {
//       case "index":
//         return <KKIndex onChangePage={handleSetPageMode} />;
//       case "add":
//         return <KKAdd onChangePage={handleSetPageMode} />;
//       case "detailDraft":
//         return (
//           <KKDetailDraft onChangePage={handleSetPageMode} withID={dataID} />
//         );
//       case "detailPublish":
//         return (
//           <KKDetailPublish onChangePage={handleSetPageMode} withID={dataID} />
//         );
//       case "edit":
//         return <KKEdit onChangePage={handleSetPageMode} withID={dataID} />;
//       default:
//         return null;
//     }
//   }

//   function handleSetPageMode(mode, withID) {
//     setDataID(withID);
//     setPageMode(mode);
//     if (mode === "add") {
//       // Redirect to /tambah route
//       navigate("/kelompok_keahlian/tambah");
//     } else {
//       // Redirect to normal routes based on mode
//       navigate(`/kelompok_keahlian/${mode}`);
//     }
//   }

//   return <div>{getPageMode()}</div>;
// }
