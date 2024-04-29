import { forwardRef } from "react";

const Input = forwardRef(function Input(
  {
    label = "",
    forInput,
    type = "text",
    placeholder = "",
    isRequired = false,
    errorMessage,
    ...props
  },
  ref
) {
  return (
    <>
      {label !== "" && (
        <div className="mb-3">
          <label htmlFor={forInput} className="form-label fw-bold">
            {label}
            {isRequired ? <span className="text-danger"> *</span> : ""}
            {errorMessage ? (
              <span className="fw-normal text-danger"> {errorMessage}</span>
            ) : (
              ""
            )}
          </label>
          <input
            id={forInput}
            name={forInput}
            type={type}
            className="form-control"
            placeholder={placeholder}
            ref={ref}
            {...props}
          />
        </div>
      )}
      {label === "" && (
        <input
          id={forInput}
          name={forInput}
          type={type}
          className="form-control"
          placeholder={placeholder}
          ref={ref}
          {...props}
        />
      )}
    </>
  );
});

export default Input;
