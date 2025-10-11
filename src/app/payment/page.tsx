import BackButton from "./components/BackButton";


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

      <BackButton
        fallback="/payments"
        className="fixed bottom-4 right-4 z-50"
      />

      <main className="max-w-5xl mx-auto p-6">
        <h2 className="text-4xl font-semibold mb-3 text-black">Información de pago</h2>

        {/* Separador corto, alineado a la izquierda */}
        <div className="my-2">
          <hr className="w-125 border-t-2 border-black" />
        </div>

        {/* LISTA CON POSICIÓN LIBRE PARA B (valores)
           - Cada fila: contenedor relative
           - A (etiqueta) se muestra normal (inline-block)
           - B (valor) es absolute y lo mueves con left/top o translate
        */}
        <dl className="space-y-6 text-black">

          {/* --- Fila: Destinatario --- */}
          <div className="relative min-h-8">
            {/* A: etiqueta con ancho fijo para consistencia visual */}
            <dt className="text-2xl font-medium inline-block w-[160px] text-left">
              Destinatario:
            </dt>
            {/* B: valor con control libre de posición */}
            <dd
              className="text-2xl leading-tight absolute top-0.5 left-[190px]"
              // También puedes usar translate: className="absolute top-0 left-0 translate-x-[170px]"
            >
              {payment.destinatario}
            </dd>
          </div>

          {/* --- Fila: Número de Transacción --- */}
          <div className="relative min-h-8">
            <dt className="text-2xl font-medium inline-block w-[160px] text-left">
              Número de Transacción:
            </dt>
            <dd className="text-2xl leading-tight absolute top-4 left-[190px]">
              {payment.numeroTransaccion}
            </dd>
          </div>

          {/* --- Fila: Sub Total --- */}
          <div className="relative min-h-8">
            <dt className="text-2xl font-medium inline-block w-[160px] text-left">
              Sub Total:
            </dt>
            {/* Ejemplo moviendo un poco más pegado a la etiqueta */}
            <dd className="text-2xl leading-tight absolute top-0 left-[190px]">
              {money(payment.subtotal)}
            </dd>
          </div>

          {/* --- Fila: Comisión --- */}
          <div className="relative min-h-8">
            <dt className="text-2xl font-medium inline-block w-[160px] text-left">
              Comisión:
            </dt>
            {/* Ejemplo bajando un poquito el valor (top-1) */}
            <dd className="text-2xl leading-tight absolute top-0 left-[190px]">
              {money(payment.comision)}
            </dd>
          </div>

          {/* --- Fila: Total --- */}
          <div className="relative min-h-8">
            <dt className="text-2xl font-semibold inline-block w-[160px] text-left">
              Total:
            </dt>
            {/* Ejemplo moviendo más a la derecha */}
            <dd className="text-2xl font-semibold leading-tight absolute top-0 left-[190px]">
              {money(payment.total)}
            </dd>
          </div>

          {/* Separador corto */}
          <div className="my-2">
            <hr className="w-125 border-t-2 border-black" />
          </div>

          {/* --- Fila: Estado --- */}
          <div className="relative min-h-8">
            <dt className="text-2xl font-medium inline-block w-[160px] text-left">
              Estado:
            </dt>
            {/* Ejemplo usando translate-x en lugar de left */}
            <dd className="text-2xl leading-tight absolute top-0 left-0 translate-x-[190px]">
              {payment.estado}
            </dd>
          </div>
        </dl>
        {/* COLUMNA DERECHA: Cuadro gris con título dentro */}
    <aside
      className="
        bg-gray-100 rounded-xl p-5
        md:justify-self-end
        w-full md:w-[420px]
        -mt-95
      "
    >
      <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
        Escanea el código QR
      </h3>

      {/* Área interna (placeholder) para el QR o contenido extra */}
      <div className="h-64 w-full rounded-lg bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500">Aquí irá el QR</span>
      </div>
    </aside>
      </main>
    </div>
  );
}
