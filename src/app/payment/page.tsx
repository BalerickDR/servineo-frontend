// src/app/payments/page.tsx
export default function PaymentsPage() {
  // 🔹 Por ahora usamos datos mock. Luego los reemplazas con lo que traiga el backend.
  const payment = {
    destinatario: "XXXXXXXXXXXXXXX",
    numeroTransaccion: "XXXXXXXXXXXXXXX",
    subtotal: 825,
    comision: 25,
    total: 850,
    estado: "XXXXXXXXXXXXXXX",
    moneda: "BOB",
  };

  // Helper para formatear moneda (lo usamos en subtotal/comisión/total)
  const money = (n: number) =>
    n.toLocaleString("es-MX", { style: "currency", currency: payment.moneda });

  return (
    <div className="min-h-screen bg-white">
      {/* Barra negra superior */}
      <header className="bg-black">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <h1 className="text-5xl font-semibold text-white">Pagos con QR</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        <h2 className="text-4xl font-semibold mb-3 text-black">Información de pago</h2>

        {/* Separador visual */}
          <div className="col-span-2 my-2">
            <hr className="w-125 border-t-2 border-black" />
          </div>
        {/* Lista etiqueta/valor:
           - grid-cols-[120px,1fr] fija 160px para etiquetas (acerca el valor)
           - gap-x-2 reduce el espacio horizontal entre etiqueta y valor
        */}
        <dl className="grid grid-cols-[180px,1fr] gap-y-2 text-black">
          {/* Etiquetas en negrita moderada; valores más grandes */}
          <dt className="text-2xl font-medium text-left">Destinatario:</dt>
          <dd className="text-2xl leading-tight">{payment.destinatario}</dd>

          <dt className="text-2xl font-medium text-left">Número de Transacción:</dt>
          <dd className="text-2xl leading-tight">{payment.numeroTransaccion}</dd>

          <dt className="text-2xl font-medium text-left">Sub Total:</dt>
          <dd className="text-2xl leading-tight">{money(payment.subtotal)}</dd>

          <dt className="text-2xl font-medium text-left">Comisión:</dt>
          <dd className="text-2xl leading-tight">{money(payment.comision)}</dd>

          <dt className="text-2xl font-semibold text-left">Total:</dt>
          <dd className="text-2xl font-semibold leading-tight">{money(payment.total)}</dd>

          {/* Separador corto */}
          <div className="col-span-2 my-2">
            <hr className="w-40 border-t-2 border-black" />
          </div>

          <dt className="text-2xl font-medium text-left">Estado:</dt>
          <dd className="text-2xl leading-tight">{payment.estado}</dd>
        </dl>
      </main>
    </div>
  );
}
