export default function ComponenteComentario({ 
    comentario, 
    setComentario, 
    placeholder = "Ej: Para llevar, sin servilletas, entregar rápido...",
    maxLength = 200
}) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-3">
            <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder={placeholder}
                className="w-full p-2 border border-gray-200 rounded-lg focus:border-green-500 focus:outline-none resize-none text-sm transition-colors"
                rows={2}
                maxLength={maxLength}
            />
            <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-500">
                    {comentario.length}/{maxLength} caracteres
                </span>
                {comentario && (
                    <button
                        onClick={() => setComentario('')}
                        className="text-xs text-red-500 hover:text-red-700 transition-colors"
                    >
                        Limpiar
                    </button>
                )}
            </div>
        </div>
    );
}