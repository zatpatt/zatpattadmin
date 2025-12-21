import React, { useRef, useState, useEffect } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

export default function BarcodeScanner({ onScan }) {
  const videoRef = useRef(null);
  const readerRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");

  const startScan = async () => {
    try {
      readerRef.current = new BrowserMultiFormatReader();
      const devices =
        await BrowserMultiFormatReader.listVideoInputDevices();
      const deviceId = devices[0]?.deviceId;

      setScanning(true);

      await readerRef.current.decodeFromVideoDevice(
        deviceId,
        videoRef.current,
        (result) => {
          if (result) {
            onScan(result.getText());
          }
        }
      );
    } catch (e) {
      setError("Camera access failed.");
    }
  };

  const stopScan = () => {
    readerRef.current?.reset();
    setScanning(false);
  };

  useEffect(() => {
    return () => readerRef.current?.reset();
  }, []);

  return (
    <div className="space-y-2">
      {!scanning ? (
        <button
          onClick={startScan}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm"
        >
          Start Scanner
        </button>
      ) : (
        <>
          <video
            ref={videoRef}
            className="w-full max-h-[300px] rounded-xl border"
          />
          <button
            onClick={stopScan}
            className="text-xs text-gray-600 mt-1"
          >
            Stop scanning
          </button>
        </>
      )}

      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}
