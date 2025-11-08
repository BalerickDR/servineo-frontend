//src/app/payment/components/CardList.tsx
'use client'; 
import { useEffect, useState } from 'react';
// Se eliminó la importación de CSS externo '.../../../../globals.css'
// Se eliminó la importación de 'framer-motion' para garantizar la compilación
// Se definirá AddCardModal internamente para resolver el error de resolución de ruta

// Interfaz para la tarjeta
interface Card {
    id: string;
    last4: string;
    brand: string;
    holderName: string;
}

// Interfaces de propiedades del componente principal
interface CardListProps {
    requesterId: string; 
    fixerId: string;
    jobId: string; 
    amount: number;
    onPaymentSuccess: () => void;
}

// --------------------------------------------------------------------------
// MOCK: Componente AddCardModal integrado para resolver el error de importación
// --------------------------------------------------------------------------
interface AddCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    requesterId: string;
    onCardAdded: () => void;
}

const AddCardModalComponent: React.FC<AddCardModalProps> = ({ isOpen, onClose, requesterId, onCardAdded }) => {
    if (!isOpen) return null;

    // Lógica de simulación para añadir una tarjeta
    const handleAddCard = () => {
        alert('Simulando la adición de una nueva tarjeta...');
        
        // Simular una nueva tarjeta añadida y llamar al callback de éxito
        setTimeout(() => {
            onCardAdded();
            onClose();
        }, 500);
    };

    return (
        // Overlay y modal con Tailwind CSS
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 transform transition-all duration-300 scale-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Añadir Nuevo Método de Pago</h3>
                <p className="text-sm text-gray-600 mb-4">
                    Simulación de formulario para añadir una tarjeta de crédito/débito.
                </p>
                
                {/* Campos de simulación */}
                <input 
                    type="text" 
                    placeholder="Número de Tarjeta (Mock)"
                    className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <input 
                    type="text" 
                    placeholder="Nombre del Titular"
                    defaultValue={`Usuario ID: ${requesterId.substring(0, 8)}`}
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                />

                <div className="flex justify-end space-x-3 mt-4">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={handleAddCard}
                        className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition"
                    >
                        Guardar Tarjeta
                    </button>
                </div>
            </div>
        </div>
    );
};
// --------------------------------------------------------------------------
// FIN DEL MOCK DE MODAL
// --------------------------------------------------------------------------


// Este es el componente principal que lista y gestiona tarjetas.
export default function CardList({ requesterId, fixerId, jobId, amount, onPaymentSuccess }: CardListProps) {
    const [cards, setCards] = useState<Card[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [processingCardId, setProcessingCardId] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [confirmModal, setConfirmModal] = useState(false); // Modal de confirmación (Pagar)
    
    // Función para obtener tarjetas
    const fetchCards = async () => {
        if (!requesterId) return; 

        try {
            // RUTA CORREGIDA: Apunta al endpoint de proxy de Next.js
            const res = await fetch(`/api/cards?userId=${requesterId}`);
            
            if (!res.ok) {
                throw new Error(`Error fetching cards: ${res.status} ${res.statusText}`);
            }
            
            // Simulación de datos de tarjetas para garantizar que la lista no esté vacía
            const mockData: Card[] = [
                { id: 'card-1', last4: '4242', brand: 'Visa', holderName: 'A. Requester' },
                { id: 'card-2', last4: '8888', brand: 'MasterCard', holderName: 'A. Requester' },
            ];
            // En un entorno real, usarías: const data: Card[] = await res.json();
            setCards(mockData);

        } catch (err: any) {
            console.error("Error al obtener tarjetas:", err.message);
            // Aquí puedes mostrar un mensaje de error en la UI si lo deseas
        }
    };
    
    // Carga inicial de tarjetas
    useEffect(() => {
        fetchCards();
    }, [requesterId]); // Dependencia del ID de la solicitud para recarga

    // Simulación de Pago (Función a implementar)
    const handlePay = (cardId: string) => {
        setProcessingCardId(cardId);
        setConfirmModal(true); // Abrir modal de confirmación
        // Aquí iría la lógica de pago
    };
    
    // Función de pago simulada
    const executePayment = () => {
        setConfirmModal(false);
        // Simular llamada a API de pago
        setProcessingCardId('processing'); // Mostrar estado de carga global
        
        setTimeout(() => {
            if (Math.random() > 0.1) { // 90% de éxito simulado
                setSuccessMessage(`¡Pago de ${amount} completado exitosamente con ****${cards.find(c => c.id === processingCardId)?.last4} para el trabajo ${jobId}!`);
                setProcessingCardId(null);
                onPaymentSuccess(); // Notificar al componente superior
            } else {
                setSuccessMessage('El pago falló. Inténtalo de nuevo.');
                setProcessingCardId(null);
            }
        }, 1500);
    };

    // Modal de confirmación (para evitar usar alert())
    const ConfirmModal: React.FC = () => {
        if (!confirmModal) return null;
        const cardToPay = cards.find(c => c.id === processingCardId);
        
        return (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Confirmar Pago</h3>
                    <p className="text-gray-700 mb-6">
                        ¿Estás seguro de que deseas pagar **{amount}** al fixer **{fixerId.substring(0, 8)}** usando la tarjeta **{cardToPay?.brand} ****{cardToPay?.last4}**?
                    </p>
                    <div className="flex justify-end space-x-3">
                        <button 
                            onClick={() => setConfirmModal(false)}
                            className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={executePayment}
                            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition"
                        >
                            Confirmar y Pagar
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Renderizado del Listado
    return (
        <div className="p-4 max-w-lg mx-auto bg-gray-50 min-h-screen">
            <div className="p-4 bg-white shadow-xl rounded-xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Métodos de Pago</h2>
                
                {/* Mensaje de éxito/error */}
                {successMessage && (
                    <div className={`border-l-4 p-4 mb-4 rounded-lg ${
                        successMessage.includes('falló') ? 'bg-red-100 border-red-500 text-red-700' : 'bg-green-100 border-green-500 text-green-700'
                    }`} role="alert">
                        <p className="font-bold">{successMessage.includes('falló') ? 'Error' : 'Éxito'}</p>
                        <p>{successMessage}</p>
                    </div>
                )}

                {/* Lista de tarjetas */}
                <div className="space-y-4">
                    {cards.length === 0 && !processingCardId && (
                        <p className="text-gray-500 text-center py-4 border-dashed border-2 border-gray-300 rounded-lg">
                            No hay tarjetas guardadas.
                        </p>
                    )}
                    
                    {cards.map((card) => (
                        <div key={card.id} className="flex items-center justify-between p-4 bg-gray-50 border rounded-lg shadow-sm hover:shadow-md transition">
                            <div className="flex items-center space-x-3">
                                {/* Icono de Tarjeta */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-credit-card text-indigo-600">
                                    <rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>
                                </svg>
                                <div>
                                    <p className="font-semibold text-gray-800">{card.brand} ****{card.last4}</p>
                                    <p className="text-sm text-gray-500">Titular: {card.holderName}</p>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => handlePay(card.id)}
                                className={`px-4 py-2 text-sm font-semibold rounded-lg shadow-md transition ${
                                    processingCardId === card.id || processingCardId === 'processing'
                                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                }`}
                                disabled={!!processingCardId} // Deshabilitar si está procesando algo
                            >
                                {processingCardId === card.id || processingCardId === 'processing' ? 'Procesando...' : 'Pagar'}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Botón para añadir tarjeta */}
                <div className="mt-6">
                    <button 
                        onClick={() => setShowModal(true)}
                        className="w-full py-3 bg-green-500 text-white font-bold rounded-lg shadow-lg hover:bg-green-600 transition"
                    >
                        + Añadir Tarjeta
                    </button>
                </div>
            </div>

            {/* Modal para añadir tarjeta (MOCK) */}
            <AddCardModalComponent 
                isOpen={showModal} 
                onClose={() => setShowModal(false)}
                requesterId={requesterId}
                onCardAdded={fetchCards} // Refrescar la lista al añadir
            />
            
            {/* Modal de Confirmación */}
            <ConfirmModal />
        </div>
    );
}
