// import Menu from "./Menu";

// export default function SideBar({ listMenu }) {
//   return (
//     <div className="border-end position-fixed h-100 pt-2 overflow-y-auto sidebarMenu">
//       <Menu listMenu={listMenu} />
//       <div className="card card-legend">
//         <div className="card-title text-center text-white bg-secondary p-0">
//           <p className="mb-1">Legend</p>
//         </div>
//         <div className="card-body">
//           <p>sjosdos</p>
//           <p>sjosdos</p>
//         </div>
//       </div>
//     </div>
//   );
// }

import { left } from "@popperjs/core";
import Menu from "./Menu";

export default function SideBar({ listMenu }) {
  return (
    <div
      className={
        location.pathname === "/kelompok_keahlian"
          ? "border-end position-fixed h-100 pt-2 sidebarMenu d-flex flex-column"
          : "border-end position-fixed h-100 pt-2 sidebarMenu d-flex flex-column overflow-y-auto"
      }
    >
      <div
        className={
          location.pathname === "/kelompok_keahlian"
            ? "flex-grow-1 overflow-y-auto"
            : "flex-grow-1"
        }
      >
        <Menu listMenu={listMenu} />
      </div>
      {location.pathname === "/kelompok_keahlian" && (
        <div className="card-legend">
          <div className="card m-2">
            <div className="card-title text-center text-white bg-secondary p-0">
              <p className="mb-1">Legend</p>
            </div>
            <div className="card-body p-1">
              <p className="mb-0">
                <span
                  className="me-2"
                  style={{ paddingLeft: "20px", backgroundColor: "#67ACE9" }}
                ></span>
                Aktif
              </p>
              <p className="mb-0">
                <span
                  className="me-2"
                  style={{ paddingLeft: "20px", backgroundColor: "#6c757d" }}
                ></span>
                Tidak Aktif
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
