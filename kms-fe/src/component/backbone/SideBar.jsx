import Menu from "./Menu";

export default function SideBar() {
  return (
    <div className="border-end position-fixed h-100 pt-2 overflow-y-auto sidebarMenu">
      <Menu />
    </div>
  );
}
