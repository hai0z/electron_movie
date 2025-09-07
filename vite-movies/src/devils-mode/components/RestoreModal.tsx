import { useEffect, useState } from "react";

export default function RestoreModal() {
  const [open, setOpen] = useState(false);
  const electron = (window as any).electron;

  useEffect(() => {
    electron.ipcRenderer.on("restore-success", () => {
      setOpen(true);
    });
  }, []);

  return (
    <>
      <input type="checkbox" className="modal-toggle" checked={open} readOnly />
      <div className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Khôi phục thành công 🎉</h3>
          <p className="py-4">Dữ liệu của bạn đã được khôi phục.</p>
          <div className="modal-action">
            <button className="btn btn-primary" onClick={() => setOpen(false)}>
              OK
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
