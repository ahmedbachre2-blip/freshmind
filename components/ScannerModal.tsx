"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  BarcodeFormat,
  BrowserMultiFormatReader,
  DecodeHintType,
  NotFoundException,
} from "@zxing/library";
import { fetchOpenFoodFacts } from "@/lib/open-food-facts";
import { isoDateOffset, estimateExpiryDays } from "@/lib/expiration";
import type { ProductDraft } from "@/lib/types";
import { ProductForm } from "./ProductForm";

type Step = "camera" | "loading" | "form" | "error";

export function ScannerModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (draft: ProductDraft) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const handledRef = useRef(false);
  const [step, setStep] = useState<Step>("camera");
  const [scanSession, setScanSession] = useState(0);
  const [message, setMessage] = useState("");
  const [draft, setDraft] = useState<ProductDraft | null>(null);

  const stopReader = useCallback(() => {
    readerRef.current?.reset();
    readerRef.current = null;
  }, []);

  const handleBarcode = useCallback(
    async (barcode: string) => {
      if (handledRef.current) return;
      handledRef.current = true;
      stopReader();
      setStep("loading");
      setMessage("Buscando producto…");

      try {
        const off = await fetchOpenFoodFacts(barcode);
        setDraft({
          barcode,
          name: off.name || `Producto ${barcode}`,
          category: off.category,
          brand: off.brand,
          imageUrl: off.imageUrl,
          expirationDate: isoDateOffset(estimateExpiryDays(off.category)),
        });  
          setStep("form");
      }  catch {
        setMessage("No se pudo obtener el producto. Inténtalo de nuevo.");
        setStep("error");
      }
    },
    [stopReader]
  );

  useEffect(() => {
    if (!open) {
      stopReader();
      handledRef.current = false;
      setStep("camera");
      setDraft(null);
      setMessage("");
      return;
    }

    handledRef.current = false;
    setStep("camera");
    setDraft(null);

    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
      BarcodeFormat.CODE_128,
      BarcodeFormat.CODE_39,
    ]);
    hints.set(DecodeHintType.TRY_HARDER, true);

    const reader = new BrowserMultiFormatReader(hints, 300);
    readerRef.current = reader;

    let cancelled = false;

    const start = async () => {
      if (!videoRef.current) return;
      try {
        await reader.decodeFromConstraints(
          { video: { facingMode: { ideal: "environment" } } },
          videoRef.current,
          (result, error) => {
            if (cancelled || handledRef.current) return;
            if (result) {
              void handleBarcode(result.getText());
              return;
            }
            if (error && !(error instanceof NotFoundException)) {
              setMessage("No se pudo leer el código. Ajusta el encuadre.");
            }
          }
        );
      } catch {
        if (!cancelled) {
          setMessage(
            "No se pudo acceder a la cámara. Comprueba los permisos del navegador."
          );
          setStep("error");
        }
      }
    };

    const timer = window.setTimeout(() => {
      void start();
    }, 80);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      stopReader();
    };
  }, [open, scanSession, handleBarcode, stopReader]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-4">
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-5 shadow-xl sm:rounded-3xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">
            {step === "form" ? "Nuevo producto" : "Escanear código"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-2 py-1 text-sm text-slate-500 hover:bg-slate-100"
            aria-label="Cerrar"
          >
            Cerrar
          </button>
        </div>

        {step === "camera" || step === "loading" ? (
          <div>
            <div className="overflow-hidden rounded-2xl bg-slate-900">
              <video
                ref={videoRef}
                className="aspect-[4/3] w-full object-cover"
                muted
                playsInline
                autoPlay
              />
            </div>
            <p className="mt-3 text-center text-sm text-slate-500">
              {step === "loading"
                ? message
                : "Apunta al código de barras del producto"}
            </p>
            {step === "camera" ? (
              <ManualBarcode onSubmit={handleBarcode} />
            ) : null}
          </div>
        ) : null}

        {step === "error" ? (
          <div className="space-y-4">
            <p className="text-sm text-red-600">{message}</p>
            <button
              type="button"
              onClick={() => {
                handledRef.current = false;
                setMessage("");
                setScanSession((value) => value + 1);
              }}
              className="w-full rounded-xl bg-fresh-600 py-2.5 text-sm font-medium text-white"
            >
              Reintentar
            </button>
          </div>
        ) : null}

        {step === "form" && draft ? (
          <ProductForm
            draft={draft}
            onChange={setDraft}
            onCancel={onClose}
            onSave={() => {
              onSave(draft);
              onClose();
            }}
          />
        ) : null}
      </div>
    </div>
  );
}

function ManualBarcode({ onSubmit }: { onSubmit: (barcode: string) => void }) {
  const [value, setValue] = useState("");

  return (
    <form
      className="mt-4 flex gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        const barcode = value.trim();
        if (barcode) onSubmit(barcode);
      }}
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        inputMode="numeric"
        placeholder="O escribe el código"
        className="flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none ring-fresh-500 focus:ring-2"
      />
      <button
        type="submit"
        className="rounded-xl bg-slate-100 px-3 py-2.5 text-sm font-medium text-slate-700"
      >
        Buscar
      </button>
    </form>
  );
}
