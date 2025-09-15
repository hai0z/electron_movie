import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const PinLock = () => {
  const ipcRenderer = (window as any).window.electron.ipcRenderer;
  const [enabled, setEnabled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showRecoverModal, setShowRecoverModal] = useState(false);
  const [recoverKey, setRecoverKey] = useState("");
  const [pin, setPin] = useState(["", "", "", ""]);
  const [confirmPin, setConfirmPin] = useState(["", "", "", ""]);
  const [step, setStep] = useState<"set" | "confirm">("set");

  const user = localStorage.getItem("user");

  useEffect(() => {
    if (user) {
      const stored = JSON.parse(user).lockApp;
      if (stored) setEnabled(true);
    }
  }, []);

  useEffect(() => {
    if (showModal) {
      setTimeout(() => {
        const firstInput = document.getElementById(
          `${step}-0`
        ) as HTMLInputElement;
        firstInput?.focus();
      }, 50);
    }
  }, [showModal, step]);

  const handleSwitch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setEnabled(checked);

    if (checked) {
      const stored = JSON.parse(localStorage.getItem("user")!).havedPin;
      if (!stored) {
        setShowModal(true);
      }
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...JSON.parse(localStorage.getItem("user")!),
          lockApp: true,
        })
      );
      ipcRenderer.send("set-lock-app");
    } else {
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...JSON.parse(localStorage.getItem("user")!),
          lockApp: false,
        })
      );
      ipcRenderer.send("unset-lock-app");
      toast.success("Đã tắt tính năng khoá app");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    type: "set" | "confirm"
  ) => {
    const value = e.target.value.replace(/\D/, "");
    if (type === "set") {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);
    } else {
      const newPin = [...confirmPin];
      newPin[index] = value;
      setConfirmPin(newPin);
    }

    if (value && index < 3) {
      document.getElementById(`${type}-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
    type: "set" | "confirm"
  ) => {
    if (e.key === "Backspace") {
      if (
        (type === "set" ? pin[index] : confirmPin[index]) === "" &&
        index > 0
      ) {
        document.getElementById(`${type}-${index - 1}`)?.focus();
      }
    }
  };

  const handleSubmit = () => {
    const pinCode = pin.join("");
    const confirmCode = confirmPin.join("");

    if (pinCode.length < 4 || confirmCode.length < 4) {
      toast.error("PIN phải có 4 số!");
      return;
    }
    if (pinCode !== confirmCode) {
      toast.error("PIN không trùng nhau!");
      return;
    }

    ipcRenderer.send("set-pin", pinCode);
  };

  useEffect(() => {
    ipcRenderer.on("recover-key", (data: any) => {
      localStorage.setItem(
        "user",
        JSON.stringify({ ...JSON.parse(user!), lockApp: true, havedPin: true })
      );
      ipcRenderer.send("set-lock-app");
      setShowModal(false);
      setStep("set");
      setPin(["", "", "", ""]);
      setConfirmPin(["", "", "", ""]);
      setRecoverKey(data);
      setShowRecoverModal(true);
    });

    ipcRenderer.on("get-recovery-key-result", (data: string) => {
      setRecoverKey(data);
      setShowRecoverModal(true);
    });
  }, []);

  const copyRecoverKey = async () => {
    try {
      await navigator.clipboard.writeText(recoverKey);
      toast.success("Đã copy Recovery Key!");
    } catch {
      toast.error("Không thể copy!");
    }
  };

  return (
    <div className="my-2">
      <div className="flex items-center gap-3 justify-between">
        <span className="font-medium">Khoá App</span>
        <input
          type="checkbox"
          className="toggle toggle-primary"
          checked={enabled}
          onChange={handleSwitch}
        />
      </div>

      {/* Nút xem lại Recovery Key */}
      {JSON.parse(user!).havedPin && (
        <div className="mt-2">
          <button
            className="btn btn-outline btn-sm"
            onClick={() => {
              ipcRenderer.send("get-recovery-key");
            }}
          >
            Xem lại Recovery Key
          </button>
        </div>
      )}

      {/* Modal set PIN */}
      <dialog
        open={showModal}
        className={`modal ${showModal ? "modal-open" : ""}`}
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">
            {step === "set" ? "Set New PIN" : "Confirm PIN"}
          </h3>

          <div className="flex gap-3 justify-center mb-4">
            {(step === "set" ? pin : confirmPin).map((val, idx) => (
              <input
                key={idx}
                id={`${step}-${idx}`}
                type="password"
                maxLength={1}
                value={val}
                onChange={(e) => handleChange(e, idx, step)}
                onKeyDown={(e) => handleKeyDown(e, idx, step)}
                className="input input-bordered w-12 text-center text-xl"
              />
            ))}
          </div>

          {step === "set" ? (
            <button
              onClick={() => setStep("confirm")}
              className="btn btn-primary w-full"
              disabled={pin.some((p) => p === "")}
            >
              Next
            </button>
          ) : (
            <button onClick={handleSubmit} className="btn btn-success w-full">
              Confirm
            </button>
          )}

          <div className="modal-action">
            <button
              className="btn"
              onClick={() => {
                setShowModal(false);
                setEnabled(false);
                setStep("set");
                setPin(["", "", "", ""]);
                setConfirmPin(["", "", "", ""]);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>

      {/* Modal Recover Key */}
      <dialog open={showRecoverModal} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-red-500 mb-4">
            ⚠️ Quan trọng!
          </h3>
          <p className="mb-2">
            Đây là <span className="font-bold">Recovery Key</span> của bạn. Hãy
            lưu lại ở nơi an toàn, vì nếu quên PIN bạn chỉ có thể khôi phục bằng
            key này.
          </p>
          <div className="flex items-center gap-2 mb-4">
            <div className=" border rounded p-3 text-center font-mono text-lg flex-1">
              {recoverKey}
            </div>
            <button className="btn btn-outline btn-sm" onClick={copyRecoverKey}>
              Copy
            </button>
          </div>
          <button
            className="btn btn-primary w-full"
            onClick={() => {
              setShowRecoverModal(false);
              toast.success("Hãy đảm bảo bạn đã lưu lại Recovery Key!");
            }}
          >
            Tôi đã lưu lại
          </button>
        </div>
      </dialog>
    </div>
  );
};

export default PinLock;
