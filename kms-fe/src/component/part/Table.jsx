import Icon from "./Icon";

export default function Table({
  data,
  onToggle = () => {},
  onCancel = () => {},
  onDelete = () => {},
  onDetail = () => {},
  onEdit = () => {},
  onApprove = () => {},
  onReject = () => {},
  onSent = () => {},
}) {
  let colPosition;
  let colCount = 0;

  function generateActionButton(columnName, value, key, id, status) {
    if (columnName === "StatusTest") {
      let displayValue = value;
  
      switch (value) {
        case "Lulus":
          displayValue = "StatusGood";
          break;
        case "Tidak Lulus":
          displayValue = "StatusBad";
          break;
        default:
          break;
      }
    
      let backgroundColor, borderColor, textColor;
      
      switch (displayValue) {
        case "StatusGood":
          backgroundColor = "#EEFFFC";
          borderColor = "#1BCFB4";
          textColor = "#1BCFB4";
          break;
        case "StatusBad":
          backgroundColor = "#FFF1F2";
          borderColor = "#FB7185";
          textColor = "#FB7185";
          break;
        default:
          backgroundColor = "#FFF1F2";
          borderColor = "#FB7185";
          textColor = "#FB7185";
      }
  
      return (
        <div
          key={key}
          className="status-container"
          style={{
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            borderWidth: "2px",
            borderStyle: "solid",
            borderRadius: "4px",
            textAlign: "center",
            color: textColor,
            padding: "4px 8px",
            display: "inline-block",
            width: "auto",
            fontWeight: "bold",
          }}
        >
          {value}
        </div>
      );
    }

    if (columnName === "Bad") {
      return (
        <div
          key={key}
          className="status-container"
          style={{
            backgroundColor: "#FFF1F2",
            borderColor: "#FB7185",
            borderWidth: "3px",
            borderStyle: "solid",
            borderRadius: "6px",
            textAlign: "center",
            fontWeight: "bold",
            color: "#FB7185",
            padding: "4px 8px",
            display: "inline-block", 
            width: "auto", 
          }}
        >
          {value}
        </div>
      );
    }

    if (columnName === "Good") {
      return (
        <div
          key={key}
          className="status-container"
          style={{
            backgroundColor: "#FFF1F2",
            borderColor: "#FB7185",
            borderWidth: "3px",
            borderStyle: "solid",
            borderRadius: "6px",
            textAlign: "center",
            fontWeight: "bold",
            color: "#FB7185",
            padding: "4px 8px",
            display: "inline-block", 
            width: "auto", 
          }}
        >
          {value}
        </div>
      );
    }

    if (columnName !== "Aksi") return value;

    const listButton = value.map((action) => {
      switch (action) {
        case "Toggle": {
          if (status === "Aktif") {
            return (
              <Icon
                key={key + action}
                name="toggle-on"
                type="Bold"
                cssClass="btn px-1 py-0 text-primary"
                title="Nonaktifkan"
                onClick={() => onToggle(id)}
              />
            );
          } else if (status === "Tidak Aktif") {
            return (
              <Icon
                key={key + action}
                name="toggle-off"
                type="Bold"
                cssClass="btn px-1 py-0 text-secondary"
                title="Aktifkan"
                onClick={() => onToggle(id)}
              />
            );
          }
        }
        case "Cancel":
          return (
            <Icon
              key={key + action}
              name="delete-document"
              type="Bold"
              cssClass="btn px-1 py-0 text-danger"
              title="Batalkan"
              onClick={onCancel}
            />
          );
        case "Delete":
          return (
            <Icon
              key={key + action}
              name="trash"
              type="Bold"
              cssClass="btn px-1 py-0 text-danger"
              title="Hapus"
              onClick={onDelete}
            />
          );
        case "Detail":
          return (
            <Icon
              key={key + action}
              name="overview"
              type="Bold"
              cssClass="btn px-1 py-0 text-primary"
              title="Lihat Detail"
              onClick={() => onDetail("detail", id)}
            />
          );
        case "Edit":
          return (
            <Icon
              key={key + action}
              name="edit"
              type="Bold"
              cssClass="btn px-1 py-0 text-primary"
              title="Ubah"
              onClick={() => onEdit("edit", id)}
            />
          );
        case "Approve":
          return (
            <Icon
              key={key + action}
              name="check"
              type="Bold"
              cssClass="btn px-1 py-0 text-success"
              title="Setujui Pengajuan"
              onClick={onApprove}
            />
          );
        case "Reject":
          return (
            <Icon
              key={key + action}
              name="cross"
              type="Bold"
              cssClass="btn px-1 py-0 text-danger"
              title="Tolak Pengajuan"
              onClick={onReject}
            />
          );
        case "Sent":
          return (
            <Icon
              key={key + action}
              name="paper-plane"
              type="Bold"
              cssClass="btn px-1 py-0 text-primary"
              title="Kirim Pengajuan"
              onClick={onSent}
            />
          );
        default:
          return null;
      }
    });

    return listButton;
  }

  return (
    <div className="flex-fill">
      <table className="table table-hover table-striped table table-light border">
        <thead>
          <tr>
            {Object.keys(data[0]).map((value, index) => {
              if (
                value !== "Key" &&
                value !== "Count" &&
                value !== "Alignment"
              ) {
                colCount++;
                return (
                  <th key={"Header" + index} className="text-center">
                    {value}
                  </th>
                );
              }
            })}
          </tr>
        </thead>
        <tbody>
          {data[0].Count !== 0 &&
            data.map((value, rowIndex) => {
              colPosition = -1;
              return (
                <tr key={value["Key"]}>
                  {Object.keys(value).map((column, colIndex) => {
                    if (
                      column !== "Key" &&
                      column !== "Count" &&
                      column !== "Alignment"
                    ) {
                      colPosition++;
                      return (
                        <td
                          key={rowIndex + "" + colIndex}
                          style={{
                            textAlign: value["Alignment"][colPosition],
                          }}
                        >
                          {generateActionButton(
                            column,
                            value[column],
                            "Action" + rowIndex + colIndex,
                            value["Key"],
                            value["Status"]
                          )}
                        </td>
                      );
                    }
                  })}
                </tr>
              );
            })}
          {data[0].Count === 0 && (
            <tr>
              <td colSpan={colCount}>Tidak ada data.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
