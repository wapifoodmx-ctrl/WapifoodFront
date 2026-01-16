import { useState, useEffect, useRef } from 'react';
import { IoChatbubbleEllipsesOutline, IoClose, IoSend, IoSparkles } from 'react-icons/io5';
import { sendChatMessage } from '@/useCases/chatbot';
import { checkPayment } from '@/useCases/checkPayment';
import { toast } from './Toast';
import { getQuestionsByView } from '@/utils/chatbotQuestions';

export default function ChatBot({ viewName = 'general' }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasActiveSubscription, setHasActiveSubscription] = useState(null);
    const [isCheckingSubscription, setIsCheckingSubscription] = useState(true);
    const messagesEndRef = useRef(null);

    const suggestedQuestions = getQuestionsByView(viewName);

    // Verificar suscripción al montar
    useEffect(() => {
        checkSubscription();
    }, []);

    // Auto-scroll cuando hay nuevos mensajes
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const checkSubscription = async () => {
        try {
            setIsCheckingSubscription(true);
            const data = await checkPayment();
            setHasActiveSubscription(data?.has_active_subscription || false);
        } catch (error) {
            console.error('Error al verificar suscripción:', error);
            setHasActiveSubscription(false);
        } finally {
            setIsCheckingSubscription(false);
        }
    };

    const handleToggleChat = () => {
        if (!isOpen && !hasActiveSubscription && !isCheckingSubscription) {
            toast.warning('Para ocupar el chat bot necesitas tener una suscripción activa');
            return;
        }
        setIsOpen(!isOpen);
        
        // Mensaje de bienvenida
        if (!isOpen && messages.length === 0) {
            setMessages([{
                type: 'bot',
                text: '¡Hola! Bienvenido a WapiFood. ¿En qué puedo ayudarte hoy?',
                timestamp: new Date()
            }]);
        }
    };

    const handleSendMessage = async (messageText = inputValue) => {
        if (!messageText.trim()) return;

        const userMessage = {
            type: 'user',
            text: messageText,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await sendChatMessage(messageText);
            
            const botMessage = {
                type: 'bot',
                text: response.respuesta || 'Lo siento, no pude procesar tu pregunta.',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error al enviar mensaje:', error);
            const errorMessage = {
                type: 'bot',
                text: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestedQuestion = (question) => {
        handleSendMessage(question);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (isCheckingSubscription) {
        return null; // No mostrar nada mientras verifica la suscripción
    }

    return (
        <>
            {/* Botón flotante */}
            <button
                onClick={handleToggleChat}
                className={`fixed bottom-6 left-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 ${
                    hasActiveSubscription 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700' 
                        : 'bg-gray-400 cursor-not-allowed'
                }`}
                title={hasActiveSubscription ? 'Abrir asistente WapiFood' : 'Necesitas suscripción activa'}
            >
                {isOpen ? (
                    <IoClose className="text-white text-2xl" />
                ) : (
                    <IoChatbubbleEllipsesOutline className="text-white text-2xl" />
                )}
            </button>

            {/* Ventana del chat */}
            {isOpen && (
                <div className="fixed bottom-24 left-6 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 text-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <IoSparkles className="text-xl" />
                            <div>
                                <h3 className="font-bold text-lg">Asistente WapiFood</h3>
                                <p className="text-xs text-green-100">Siempre listo para ayudarte</p>
                            </div>
                        </div>
                        <button 
                            onClick={handleToggleChat}
                            className="hover:bg-white/20 rounded-full p-1 transition-colors"
                        >
                            <IoClose className="text-2xl" />
                        </button>
                    </div>

                    {/* Mensajes */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-2xl ${
                                        message.type === 'user'
                                            ? 'bg-green-500 text-white rounded-br-none'
                                            : 'bg-white text-gray-800 shadow-sm rounded-bl-none border border-gray-200'
                                    }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                                    <span className={`text-xs mt-1 block ${
                                        message.type === 'user' ? 'text-green-100' : 'text-gray-400'
                                    }`}>
                                        {message.timestamp.toLocaleTimeString('es-MX', { 
                                            hour: '2-digit', 
                                            minute: '2-digit' 
                                        })}
                                    </span>
                                </div>
                            </div>
                        ))}
                        
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-200">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Preguntas sugeridas */}
                    {messages.length <= 1 && (
                        <div className="px-4 py-2 border-t border-gray-200 bg-white">
                            <p className="text-xs text-gray-500 mb-2 font-semibold">Preguntas frecuentes:</p>
                            <div className="flex flex-wrap gap-2">
                                {suggestedQuestions.slice(0, 3).map((question, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSuggestedQuestion(question)}
                                        className="text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-full hover:bg-green-100 transition-colors border border-green-200"
                                    >
                                        {question}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <div className="p-4 border-t border-gray-200 bg-white">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Escribe tu pregunta..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                disabled={isLoading}
                            />
                            <button
                                onClick={() => handleSendMessage()}
                                disabled={!inputValue.trim() || isLoading}
                                className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <IoSend className="text-xl" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
