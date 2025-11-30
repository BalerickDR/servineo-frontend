"use client";

import { useEffect, useState } from "react";
import BackButton from "./BackButton";

type PaymentStatus = "pending" | "under_review" | "confirmed" | "rejected" | "expired";
type Intent = {
  _id: string;
  bookingId: string;
  providerId: string;
  amountExpected: number;
  currency: string;
  paymentReference: string;
  status: PaymentStatus;
  deadlineAt?: string;
  createdAt?: string;
};
type PaymentMethod = { qrImageUrl?: string; accountDisplay?: string };

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export default function PayWithQr() {
  const [intent, setIntent] = useState<Intent | null>(null);
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const bookingId = "TEST-BOOKING-1";
  const providerId = "prov_123";
  const amount = 150;
  const currency = "BOB";

  const [imgSrc, setImgSrc] = useState<string | null>(null);

  const toDriveThumb = (url: string) => {
    const m = url.match(/id=([^&]+)/);
    return m ? `https://drive.google.com/thumbnail?id=${m[1]}&sz=w512` : url;
  };

  const fallbackQR = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(
    "Servineo QR",
  )}`;

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("[PayWithQr] BACKEND_URL =", BACKEND_URL);

        const payload = { bookingId, providerId, amount, currency };
        console.log("[PayWithQr] request payload =", payload);

        const res = await fetch(`${BACKEND_URL}/api/payments/intent`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        console.log("[PayWithQr] response status =", res.status);

        const data = await res.json();
        console.log("[PayWithQr] response body =", data);

        if (!res.ok) {
          throw new Error(data?.message || data?.error || "Error al crear intent");
        }

        setIntent(data.intent);
        setMethod(data.paymentMethod || null);

        if (data.paymentMethod?.qrImageUrl) {
          setImgSrc(data.paymentMethod.qrImageUrl);
        }

        if (data.error === "NO_QR") {
          setError("El proveedor no tiene QR configurado.");
        }
      } catch (e: any) {
        console.error("[PayWithQr] error =", e);
        setError(e.message || "Error de red");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (method?.qrImageUrl) {
      setImgSrc(method.qrImageUrl);
    }
  }, [method]);

  const money = (n: number) =>
    n.toLocaleString("es-BO", { style: "currency", currency });


  return (
    <div className="min-h-screen bg-white">
      {/* Barra azul superior */}
      <header className="bg-[#2B6AE0]">
        <div className="max-w-5xl px-6 py-6">
          <h1 className="text-5xl font-semibold text-white">Pagos con QR</h1>
        </div>
      </header>

      <BackButton
        fallback="/payment/centro-de-pagos"
        className="fixed bottom-4 right-4 z-50"
      />

      <main className="max-w-5xl mx-auto p-6">
        {loading && <p>Cargando…</p>}
        {error && <p className="text-red-600 mb-3">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <section className="md:-ml-35">
            <h2 className="text-4xl font-semibold mb-3 text-black">
              Información de pago
            </h2>

            <div className="my-2">
              <hr className="w-150 border-t-2 border-[#2B6AE0]" />
            </div>

            <dl className="space-y-6 text-black">
              <div className="relative min-h-8">
                <dt className="text-2xl font-medium inline-block w-[200px] text-left">
                  Destinatario:
                </dt>
                <dd className="text-2xl leading-tight absolute top-0.5 left-[280px]">
                  {method?.accountDisplay || "—"}
                </dd>
              </div>

              <div className="relative min-h-8">
                <dt className="text-2xl font-medium inline-block w-[220px] text-left">
                  Nro de Transacción:
                </dt>
                <dd className="text-2xl leading-tight absolute top-0.5 left-[280px]">
                  {intent?.paymentReference || "—"}
                </dd>
              </div>

              <div className="relative min-h-8">
                <dt className="text-2xl font-medium inline-block w-[200px] text-left">
                  Sub Total:
                </dt>
                <dd className="text-2xl leading-tight absolute top-0 left-[280px]">
                  {intent ? money(Math.round(intent.amountExpected * 0.97)) : "—"}
                </dd>
              </div>

              <div className="relative min-h-8">
                <dt className="text-2xl font-medium inline-block w-[160px] text-left">
                  Comisión:
                </dt>
                <dd className="text-2xl leading-tight absolute top-0 left-[280px]">
                  {intent ? money(Math.round(intent.amountExpected * 0.03)) : "—"}
                </dd>
              </div>

              <div className="relative min-h-8">
                <dt className="text-2xl font-semibold inline-block w-[160px] text-left">
                  Total:
                </dt>
                <dd className="text-2xl font-semibold leading-tight absolute top-0 left-[280px]">
                  {intent ? money(intent.amountExpected) : "—"}
                </dd>
              </div>

              <div className="my-5">
                <hr className="w-150 border-t-2 border-[#2B6AE0]" />
              </div>

              <div className="relative min-h-8">
                <dt className="text-2xl font-medium inline-block w-[160px] text-left">
                  Estado:
                </dt>
                <dd className="text-2xl leading-tight absolute top-0 left-0 translate-x-[280px]">
                  {intent?.status ? intent.status.toUpperCase() : "—"}
                </dd>
              </div>

              <div className="my-6">
                <hr className="w-150 border-t-2 border-[#2B6AE0]" />
              </div>
            </dl>
          </section>

          <aside className="bg-[#759AE0] rounded-xl p-5 md:justify-self-end w-full md:w-[420px] md:ml-16 md:self-center">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
              Escanea el código QR
            </h3>

            <div className="h-64 w-full rounded-lg bg-gray-200 flex items-center justify-center">
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt="QR de pago"
                  className="max-h-60 object-contain"
                  referrerPolicy="no-referrer"
                  onError={() => {
                    if (
                      imgSrc.includes("drive.google.com") &&
                      !imgSrc.includes("/thumbnail")
                    ) {
                      setImgSrc(toDriveThumb(imgSrc));
                    } else {
                      setImgSrc(fallbackQR);
                    }
                  }}
                />
              ) : (
                <img
                  src={fallbackQR}
                  alt="QR de pago (fallback)"
                  className="max-h-60 object-contain"
                />
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
