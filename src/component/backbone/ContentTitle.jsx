import { APPLICATION_NAME } from "../util/Constants";

export default function ContentTitle() {
  return (
    <>
      <div className="border-bottom py-3 fixed-when-scroll">
        <span className="fw-bold text-primary">{APPLICATION_NAME}</span>
        &nbsp;&nbsp;/&nbsp;&nbsp;<span id="spanMenu"></span>
        <span id="spanMenuRoute"></span>
      </div>
    </>
  );
}
