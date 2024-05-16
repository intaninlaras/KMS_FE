import { forwardRef } from "react";
import { FILE_LINK } from "../util/Constants";

const FileUpload = forwardRef(function FileUpload(
  {
    formatFile = "",
    label = "",
    forInput = "",
    isRequired = false,
    errorMessage,
    hasExisting,
    ...props
  },
  ref
) {
  return (
    <>
      <div className="mb-3">
        <label htmlFor={forInput} className="form-label fw-bold">
          {label}
          {isRequired ? <span className="text-danger"> *</span> : ""}
          {errorMessage ? (
            <span className="fw-normal text-danger">
              <br />
              {errorMessage}
            </span>
          ) : (
            ""
          )}
        </label>
        <input
          className="form-control"
          type="file"
          id={forInput}
          name={forInput}
          accept={formatFile}
          ref={ref}
          {...props}
        />
        <sub>Maximum file size is 10 MB</sub>
        {hasExisting && (
          <sub>
            <br />
            Current file:{" "}
            <a
              href={FILE_LINK + hasExisting}
              className="text-decoration-none"
              target="_blank"
            >
              [Unduh Berkas]
            </a>
            <br />
            Re-upload to replace the existing file
          </sub>
        )}
      </div>
    </>
  );
});

export default FileUpload;
