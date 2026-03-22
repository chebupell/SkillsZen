import { AlertTriangle, X } from 'lucide-react';

const ResetConfirmModal = ({ isOpen, onClose, onConfirm }: { 
  isOpen: boolean, 
  onClose: () => void, 
  onConfirm: () => void 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#252526] border border-[#333] w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#333] bg-[#2d2d2d]">
          <div className="flex items-center gap-2 text-red-400 font-bold uppercase text-[10px] tracking-widest">
            <AlertTriangle size={16} /> Danger Zone
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
        
        <div className="p-8">
          <h3 className="text-lg font-bold mb-2">Reset to initial state?</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            This will permanently delete your current progress and restore the initial template. This action cannot be undone.
          </p>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 bg-[#1e1e1e] border-t border-[#333]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-wider rounded-md shadow-lg shadow-red-900/20 active:scale-95 transition-all"
          >
            Reset Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetConfirmModal;