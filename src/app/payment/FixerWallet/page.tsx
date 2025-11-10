'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

//jhoel
import TransferBank from '../components/recargar-saldo/TransferBank';

import {
  ArrowLeft,
  Wallet,
  TrendingUp,
  TrendingDown,
  CreditCard,
  QrCode,
  Building2,
} from 'lucide-react';

//cargar-saldo jhoel/klever
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CardList from '../components/CardList'; // 👈 ajusta la ruta según tu estructura

// Configuración Stripe
const stripePromise = loadStripe(
  'pk_test_51SHGq0Fp8K0s2pYx4l5z1fkIcXSouAknc9gUV6PpYKR8TjexmaC3OiJR9jNIa09e280Pa6jGVRA6ZNY7kSCCGcLt002CEmfDnU',
);

export default function FixerWalletApp() {
  //const [screen, setScreen] = useState<'wallet' | 'recharge' | 'history'>('wallet');
  const [screen, setScreen] = useState<'wallet' | 'recharge' | 'history' | 'transfer'>('wallet');
  const [amount, setAmount] = useState('0.00');
  const [isFocused, setIsFocused] = useState(false); //puesto por jhoel
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [showCardPayment, setShowCardPayment] = useState(false);

  const router = useRouter();
  const [receivedFixerId, setReceivedFixerId] = useState<string | null>(null);
  //jhoel
  const [fixerData, setFixerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useSearchParams();
  //const fixerId = params.get('fixerId');

  //tarjeta
  const fixerId = '6910e729a571aecd3e567d9e'; // quien paga (fixer) esta en colleccion users
  const servineoId = '690c1a08f32ebc5be9c5707c'; // el ID que representa a Servineo (uien recibe (Servineo))

  //qr
  const servineoQr = '68f7c764495b9ef8a357c40b';

  //para cuando servineoId y servineoQr los recupero desde el .env (CONSULTAR, ESTA PENDIENTE)
  //const servineoId = process.env.NEXT_PUBLIC_SERVINEO_ID;
  //const servineoQr = process.env.NEXT_PUBLIC_SERVINEO_QR;

  //jhoel
  useEffect(() => {
    if (fixerId) {
      setReceivedFixerId(fixerId);
    } else {
      console.warn('No se recibió fixerId en la URL.');
    }
  }, [fixerId]);

  //jhoel
  useEffect(() => {
    if (!receivedFixerId) return;
    const fetchWalletData = async () => {
      try {
        const res = await fetch(`/api/fixers/${receivedFixerId}/wallet`);
        const data = await res.json();
        console.log('Wallet data fetched:', data);
        setFixerData(data);
      } catch (error) {
        console.error('Error al cargar datos del wallet:', error);
      } finally {
        setLoading(false);
      }
    };

    if (receivedFixerId) fetchWalletData();
  }, [receivedFixerId]);

  const handleQuickAmount = (value: number) => {
    setAmount(value.toFixed(2));
  };

  const formatCurrency = (value: number) => {
    return `Bs. ${Math.abs(value).toFixed(2)}`;
  };

  //pagar con QR jhoel,klever
  const goToQR = () => {
    const fixerIdToSend = fixerData?.fixerId ?? receivedFixerId;
    const amountNumber = Number(amount);

    if (!amountNumber || amountNumber <= 0) {
      alert('Ingresa un monto válido antes de continuar.');
      return;
    }

    // Supongamos que aquí tienes un providerId válido (debe tener QR configurado)
    //const validProviderId = servineoId; // cambia si tienes otro ID válido

    const validProviderId = servineoQr; // el provider QR que sí funciona

    // Si en paymentDemo usas bookingId o trabajoId, para recarga podrías enviar algo genérico o null si la lógica lo soporta.
    const bookingId = 'recarga';

    console.log('Redirigiendo a QR con:', {
      fixerId: fixerIdToSend,
      amount: amountNumber,
      currency: 'BOB',
      type: 'wallet',
      providerId: validProviderId,
    });

    router.push(
      `/payment/qr?fixerId=${fixerIdToSend}&amount=${amountNumber}&currency=BOB&type=wallet&providerId=${validProviderId}&bookingId=${bookingId}`,
    );
    //de paymentDemo
    //router.push(`/payment/qr?trabajoId=${trabajoId}&bookingId=${bookingId}&providerId=${providerId}&amount=${amount}&currency=${currency}`);
  };

  // 🔹 Cerrar modal
  const handleCloseCardPayment = (paymentCompleted?: boolean) => {
    if (paymentCompleted) {
      alert('✅ Recarga realizada con éxito.');
      setScreen('wallet');
    }
    setShowCardPayment(false);
  };

  //jhoel
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Cargando datos del wallet...</p>
      </div>
    );
  }

  if (!fixerData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-red-500">No se pudo cargar la información del fixer.</p>
      </div>
    );
  }

  const handleFocus = () => {
    setIsFocused(true);
    if (amount === '0.00') {
      setAmount('');
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (amount === '' || amount === '.') {
      setAmount('0.00');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Permitir solo números y máximo 2 decimales
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value);
    }
  };

  // Pantalla 1: Wallet Principal
  if (screen === 'wallet') {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className="bg-blue-600 text-white px-6 py-4">
          <h1 className="text-2xl font-bold">Fixer Wallet</h1>
        </div>

        {/* Balance Card */}
        <div className="p-6">
          <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Wallet size={20} />
              <span className="text-sm opacity-90">Saldo Actual</span>
            </div>
            <div className="text-5xl font-bold mb-6">
              Bs. {fixerData?.wallet?.balance?.toFixed(2) || '0.00'}
            </div>
            <button
              onClick={() => setScreen('recharge')}
              className="w-full bg-white text-blue-600 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              Recargar Saldo
            </button>
          </div>
        </div>

        {/* Movimientos Recientes */}
        <div className="px-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-600 font-semibold text-lg">Movimentos Recientes</h2>
            <button onClick={() => setScreen('history')} className="text-blue-600 font-semibold">
              Ver todo
            </button>
          </div>

          <div className="space-y-3">
            {fixerData?.recentTransactions?.map((tx) => (
              <div
                key={tx._id}
                className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    tx.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                  }`}
                >
                  {tx.amount > 0 ? (
                    <TrendingUp className="text-green-600" size={24} />
                  ) : (
                    <TrendingDown className="text-red-600" size={24} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{tx.description}</p>
                  <p className="text-sm text-gray-500">{tx.createdAt}</p>
                </div>
                <div
                  className={`font-bold text-lg ${
                    tx.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {tx.amount > 0 ? '+' : '-'}
                  {formatCurrency(tx.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Pantalla 2: Recargar Saldo
  if (screen === 'recharge') {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className="bg-blue-600 text-white px-6 py-4">
          <h1 className="text-2xl font-bold">Recargar Saldo</h1>
        </div>

        <div className="p-6 space-y-6">
          {/* Monto */}
          <div>
            <label className="block text-gray-900 font-semibold text-lg mb-2">
              Monto a recargar (Bs.)
            </label>
            <input
              type="text"
              value={amount}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              className="w-full px-4 py-4 border-2 text-black border-gray-300 rounded-lg text-2xl font-semibold focus:border-blue-500 focus:outline-none"
              placeholder="0.00"
            />
          </div>

          {/* Montos rápidos */}
          <div className="grid grid-cols-4 gap-3">
            {[20, 50, 100, 200].map((value) => (
              <button
                key={value}
                onClick={() => handleQuickAmount(value)}
                className="bg-blue-100 hover:bg-blue-200 text-blue-600 py-3 rounded-lg font-bold text-xl transition-colors"
              >
                {value}
              </button>
            ))}
          </div>

          {/* Método de Pago */}
          <div>
            <label className="block text-gray-900 font-semibold text-lg mb-3">Metodo de Pago</label>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setSelectedMethod('card');
                  setShowCardPayment(true); // 👈 ABRIR MODAL STRIPE
                }}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  selectedMethod === 'card'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
              >
                <CreditCard size={28} className="text-gray-700" />
                <span className="text-lg font-semibold text-gray-900">Tarjeta de Crédito</span>
              </button>

              <button
                onClick={() => {
                  setSelectedMethod('qr');
                  goToQR();
                }}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  selectedMethod === 'qr'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
              >
                <QrCode size={28} className="text-gray-700" />
                <span className="text-lg font-semibold text-gray-900">Pago QR</span>
              </button>

              <button
                onClick={() => {
                  console.log('Seleccionado Transferencia Bancaria', {
                    amount,
                    receivedFixerId,
                    servineoId,
                  });
                  setSelectedMethod('transfer');
                  setScreen('transfer'); // Aquí cambia la pantalla a la transferencia bancaria
                }}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  selectedMethod === 'transfer'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
              >
                <Building2 size={28} className="text-gray-700" />
                <span className="text-lg font-semibold text-gray-900">Transferencia Bancaria</span>
              </button>
            </div>
          </div>

          {/* Botón Volver */}
          <button
            onClick={() => setScreen('wallet')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg transition-colors"
          >
            Volver
          </button>
        </div>

        {/* Modal tarjeta Stripe */}
        {showCardPayment && (
          <div className="fixed inset-0 z-[1000] bg-black/60 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-[95%] max-w-5xl max-h-[90vh] overflow-y-auto relative">
              <button
                onClick={() => handleCloseCardPayment(false)}
                className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-3xl font-bold transition-colors"
              >
                ✕
              </button>

              <Elements stripe={stripePromise}>
                <div className="flex flex-col items-center justify-center">
                  <h2 className="text-2xl font-bold text-[#111827] mb-6">
                    Selecciona tu tarjeta o agrega una nueva
                  </h2>

                  <CardList
                    userId={fixerId} // quien paga, el fixer en este caso
                    fixerId={fixerId} // quien recibe, Servineo
                    amount={Number(amount)} // monto convertido a número
                    onPaymentSuccess={() => {
                      handleCloseCardPayment(true);
                      alert('Recarga realizada con éxito');
                      setShowCardPayment(false);
                      setScreen('wallet');
                      // Opcional: refrescar datos wallet aquí
                    }}
                  />
                </div>
              </Elements>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (screen === 'transfer') {
    return (
      <TransferBank
        fixerId={receivedFixerId!} // pasa el fixerId correcto
        amount={Number(amount)} // 👈 PASAS EL MONTO
        servineoId={servineoId} // quien recibe (Servineo) - lo pasas aquí
        onBack={() => setScreen('recharge')} // para regresar a recarga
      />
    );
  }

  // Pantalla 3: Historial Completo
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-blue-600 text-white px-6 py-4 flex items-center gap-4">
        <button onClick={() => setScreen('wallet')}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Historial de Movimientos</h1>
      </div>

      {/* Balance */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm mb-1">Saldo Actual</p>
            <p className="text-blue-600 text-3xl font-bold">
              Bs. {fixerData?.wallet?.balance?.toFixed(2) || '0.00'}
            </p>
          </div>
          <Wallet size={32} className="text-blue-600" />
        </div>
      </div>

      {/* Todos los movimientos */}
      <div className="px-6">
        <h2 className="text-gray-700 font-semibold mb-4">Todos los Movimientos</h2>
        <div className="space-y-4">
          {fixerData?.allTransactions?.map((tx) => (
            <div key={tx._id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    tx.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                  }`}
                >
                  {tx.amount > 0 ? (
                    <TrendingUp className="text-green-600" size={24} />
                  ) : (
                    <TrendingDown className="text-red-600" size={24} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-bold text-gray-900">
                      {tx.type === 'deposit' ? 'Recarga' : 'Deducción de Comisión'}
                    </p>
                    <p
                      className={`font-bold text-lg whitespace-nowrap ${
                        tx.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {tx.amount > 0 ? '+' : '-'}
                      {formatCurrency(tx.amount)}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    {tx.type === 'deposit' ? tx.method : tx.description}
                  </p>
                  {tx.jobId && (
                    <button className="text-blue-600 text-sm font-semibold hover:underline">
                      Trabajo #{tx.jobId}
                    </button>
                  )}
                  <p className="text-xs text-gray-500 mt-1">{tx.createdAt}</p>

                  {/* Info de comisión */}
                  {tx.metadata && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-600">
                        <span className="font-semibold">Comisión SERVINEO:</span> 5% del trabajo
                        pagado en efectivo
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
