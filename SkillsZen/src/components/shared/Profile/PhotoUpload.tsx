import { Camera, Check, Loader2 } from "lucide-react";
import { Button } from "../../ui/button";
import { cn } from "../../../lib/utils";

interface PhotoUploadProps {
  fileInputRef: React.RefObject<HTMLInputElement | null>; 
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isProcessing: boolean;
  isAttached: boolean;
  disabled: boolean;
}

export const PhotoUpload = ({ fileInputRef, onFileChange, isProcessing, isAttached, disabled }: PhotoUploadProps) => (
  <div className="flex justify-center pb-2 w-full px-1">
    <input
      type="file"
      ref={fileInputRef}
      onChange={onFileChange}
      accept="image/*"
      className="hidden"
    />
    <Button
      type="button"
      disabled={disabled}
      onClick={() => fileInputRef.current?.click()}
      className={cn(
        'h-12 w-full rounded-2xl transition-all duration-300 gap-3 font-bold text-sm shadow-sm border-none',
        isAttached
          ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-100 shadow-lg'
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
      )}
    >
      {isProcessing ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : isAttached ? (
        <Check className="h-5 w-5 animate-in zoom-in duration-300" />
      ) : (
        <Camera className="h-5 w-5" />
      )}
      <span className="tracking-tight">
        {isProcessing ? 'Processing Photo...' : isAttached ? 'Photo Attached & Ready' : 'Change Profile Photo'}
      </span>
    </Button>
  </div>
);
