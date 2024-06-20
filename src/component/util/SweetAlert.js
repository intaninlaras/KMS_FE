import Swal from 'sweetalert2';

const SweetAlert = (
  title,
  text,
  icon,
  confirmText = "",
  inputType = null,
  placeholder = ""
) => {
  if (confirmText === "") {
    Swal.fire({
      title: title,
      html: text, // Change 'text' to 'html' to support HTML content
      icon: icon,
    });
  } else {
    let textContent = "";
    const additional = {
      input: inputType,
      inputPlaceholder: placeholder,
      inputAttributes: {
        onchange: function () {
          textContent = this.value;
        },
      },
    };

    return Swal.fire({
      title: title,
      html: text, // Change 'text' to 'html' to support HTML content
      icon: icon,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: 'Batal',
      // dangerMode: icon === "warning",
      ...(inputType === null ? {} : additional),
    }).then((result) => {
      if (inputType !== null && result.isConfirmed)
        return textContent === "" ? "-" : textContent;
      return result.isConfirmed;
    });
  }
};

export default SweetAlert;
