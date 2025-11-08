'use client';

import React from 'react';
// RUTA CONFIRMADA POR EL USUARIO: Dos niveles hacia atrás
import InvoiceDetail from '../../payment/components/InvoiceDetail'; 

// Esta es la página renderizada en la ruta dinámica /facturas/[invoiceId]
const InvoiceDetailPage: React.FC = () => {
  return (
    <div className="flex justify-center w-full min-h-screen bg-gray-50">
      <InvoiceDetail />
    </div>
  );
};

export default InvoiceDetailPage;