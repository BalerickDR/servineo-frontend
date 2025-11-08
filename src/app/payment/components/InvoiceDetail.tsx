//src/app/payment/components/InvoiceDetail.tsx - Versión Limpia y Funcional (Pre-Error)
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Loader2, ArrowLeft, Download } from 'lucide-react';

// === Bloque de Router (Next.js compatibility) ===
interface AppRouter {
    back: () => void;
}
let useRouter: () => AppRouter;
try {
    ({ useRouter } = require('next/navigation'));
} catch (e) {
    console.warn("Could not import Next.js navigation hooks. Using mock functions.");
    useRouter = () => ({ 
        back: () => console.log('[MOCK BACK] Volviendo...'),
    });
}
// === FIN: Bloque de Router ===

// Definición de tipos para la simulación de datos de la factura
interface InvoiceDetailData {
    id: string;
    date: string; // Formato DD/MM/AAAA (ej. 08/11/2025)
    status: 'PAID' | 'PENDING';
    method: string;
    jobAmount: number;
    commission: number;
    total: number;
    currency: string;
    fixerId: string;
    requesterId: string;
    jobId: string;
}

// Datos de Mock
const mockInvoiceData: { [key: string]: InvoiceDetailData } = {
    '690f570a5a182cd277643d45': {
        id: '690f570a5a182cd277643d45',
        date: '08/11/2025',
        status: 'PAID',
        method: 'Efectivo',
        jobAmount: 500.00,
        commission: 50.00,
        total: 550.00,
        currency: 'BOB',
        fixerId: '60a5e8c1d5f2a1b9c7d4e3f3',
        requesterId: '60a5e8c1d5f2a1b9c7d4e3f2',
        jobId: '60a5e8c1d5f2a1b9c7d4e3f4',
    },
    'mock-1': {
        id: 'mock-1',
        date: '07/11/2025',
        status: 'PENDING',
        method: 'Transferencia',
        jobAmount: 56.10,
        commission: 5.61,
        total: 61.71,
        currency: 'BOB',
        fixerId: 'mock-fixer',
        requesterId: 'mock-requester',
        jobId: 'mock-job',
    },
};

// Componente para una fila de detalle
const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="flex justify-between items-start py-3 border-b border-gray-100 last:border-b-0">
        <span className="text-gray-600 font-normal w-2/5 sm:w-1/3">{label}:</span>
        <span className="font-medium text-gray-900 text-right w-3/5 sm:w-2/3 break-words">
            {value}
        </span>
    </div>
);


const InvoiceDetail: React.FC = () => {
    
    const params = useParams();
    const invoiceId = Array.isArray(params.invoiceId) ? params.invoiceId[0] : params.invoiceId || '690f570a5a182cd277643d45';

    const router = useRouter();
    const [invoice, setInvoice] = useState<InvoiceDetailData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false); 

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setInvoice(mockInvoiceData[invoiceId] || mockInvoiceData['690f570a5a182cd277643d45']); 
            setLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, [invoiceId]);

    const handleDownloadSimpleText = () => {
        if (!invoice) return;
        setIsDownloading(true);

        // Lógica de descarga (Mantenida simple)
        const content = `...`;
        
        const parts = invoice.date.split('/');
        const formattedDate = parts.length === 3 ? `${parts[2]}${parts[1]}${parts[0]}` : 'SinFecha';
        const fileName = `Factura_${invoice.id}_${formattedDate}.pdf`;
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setIsDownloading(false);
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
                <Loader2 className="animate-spin text-indigo-600 mx-auto" size={48} />
            </div>
        );
    }

    if (!invoice) {
        return (
            <div className="text-center p-10 mt-20">
                <h1 className="text-2xl font-bold text-red-600">Error: Factura no encontrada</h1>
                <p className="text-gray-600 mt-2">No se pudo cargar el detalle para el ID: {invoiceId}</p>
                <button 
                    onClick={() => router.back()} 
                    className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-xl"
                >
                    Volver a la Lista
                </button>
            </div>
        );
    }

    const statusColor = invoice.status === 'PAID' 
        ? 'text-white bg-emerald-500 font-bold' 
        : 'text-amber-700 bg-amber-100 font-semibold';

    return (
        <div className="min-h-screen bg-gray-100 font-sans p-4 sm:p-8">
            
            <div className="max-w-2xl mx-auto">
                
                {/* Header con título y botones de acción */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Comprobante #{invoice.id.slice(-5)}</h1>
                    <div className="flex space-x-3">
                        <button
                            onClick={handleDownloadSimpleText} 
                            disabled={isDownloading}
                            className={`flex items-center justify-center text-white font-semibold py-2 px-4 rounded-xl shadow-md transition-all text-sm ${
                                isDownloading 
                                    ? 'bg-indigo-400 cursor-not-allowed' 
                                    : 'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                            title="Descargar Factura"
                        >
                            {isDownloading ? (
                                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                            ) : (
                                <Download className="w-5 h-5 mr-1" />
                            )}
                            {isDownloading ? 'Generando...' : 'Descargar'}
                        </button>
                        <button
                            onClick={() => router.back()}
                            className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-xl transition-colors text-sm border border-gray-300"
                            title="Volver a la lista"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Volver
                        </button>
                    </div>
                </div>
                
                {/* Contenido de la factura (Tarjeta Blanca) */}
                <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-10 border border-gray-200">
                    
                    {/* Logotipo/Encabezado dentro de la tarjeta */}
                    <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-6">
                        <div>
                            <h2 className="text-3xl font-black text-indigo-700 tracking-tighter">Servineo</h2>
                            <p className="text-md text-gray-500 font-medium mt-1">Detalle de Pago</p>
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-sm uppercase tracking-wider ${statusColor} shadow-sm`}>
                            {invoice.status === 'PAID' ? 'PAGADO' : 'PENDIENTE'}
                        </span>
                    </div>

                    {/* Información de la Transacción */}
                    <section className="mb-8 p-0">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Información de la Transacción</h2>
                        
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-1'>
                            <div>
                                <DetailRow label="ID de Pago" value={<span className="font-mono text-xs bg-gray-100 p-1 rounded">{invoice.id}</span>} />
                                <DetailRow label="Fecha" value={`${invoice.date}, 10:33:00 a.m.`} />
                                <DetailRow label="Método de Pago" value={invoice.method} />
                            </div>
                            <div className='sm:mt-0 mt-4'>
                                <DetailRow label="Fixer ID" value={<span className="font-mono text-xs bg-gray-100 p-1 rounded">{invoice.fixerId}</span>} />
                                <DetailRow label="Requester ID" value={<span className="font-mono text-xs bg-gray-100 p-1 rounded">{invoice.requesterId}</span>} />
                                <DetailRow label="Trabajo ID" value={<span className="font-mono text-xs bg-gray-100 p-1 rounded">{invoice.jobId}</span>} />
                            </div>
                        </div>

                    </section>
                    
                    <hr className='my-8 border-gray-100' />

                    {/* Resumen de Montos */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Resumen de Montos</h2>
                        
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 text-gray-700">
                                <span className="font-medium text-lg">Monto del Trabajo</span>
                                <span className="text-xl font-semibold">
                                    {invoice.currency} {invoice.jobAmount.toFixed(2).replace('.', ',')}
                                </span>
                            </div>
                            
                            <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-300">
                                <span className="text-gray-500">Comisión por Servicio (10%)</span>
                                <span className="text-lg text-gray-600">
                                    + {invoice.currency} {invoice.commission.toFixed(2).replace('.', ',')}
                                </span>
                            </div>
                        </div>
                        
                        {/* Total Final */}
                        <div className="mt-8 bg-indigo-50 p-6 rounded-2xl border border-indigo-200 text-center">
                            <div className='flex justify-between items-center'>
                                <p className="text-xl text-indigo-700 font-semibold uppercase">TOTAL FINAL PAGADO</p>
                                <p className="text-5xl font-black text-indigo-900 tracking-tight">
                                    {invoice.currency} {invoice.total.toFixed(2).replace('.', ',')}
                                </p>
                            </div>
                        </div>
                    </section>

                    <footer className="mt-10 pt-4 text-center text-xs text-gray-400 border-t border-gray-100">
                        Este comprobante es generado automáticamente por Servineo. Gracias por su pago.
                    </footer>

                </div>
            </div>
        </div>
    );
};

export default InvoiceDetail;