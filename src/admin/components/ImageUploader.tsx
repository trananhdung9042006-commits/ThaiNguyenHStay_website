import { useState, useRef, useCallback } from 'react';
import { uploadService } from '../../services/upload.service';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  className?: string;
}

function ImageUploader({ value, onChange, folder = 'general', label, className = '' }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(async (file: File) => {
    setError('');
    setUploading(true);
    try {
      const url = await uploadService.upload(file, folder);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi upload');
    } finally {
      setUploading(false);
    }
  }, [folder, onChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) handleUpload(file);
  };

  const handleRemove = async () => {
    if (value) {
      try { await uploadService.delete(value); } catch { /* ignore */ }
      onChange('');
    }
  };

  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>}

      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-white/[0.06] bg-[#0B0F19]">
          <img src={value} alt="Preview" className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              onClick={() => inputRef.current?.click()}
              className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/30 transition-colors"
            >
              Đổi ảnh
            </button>
            <button
              onClick={handleRemove}
              className="bg-red-500/20 backdrop-blur-sm text-red-300 px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-500/30 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            dragOver
              ? 'border-emerald-500/50 bg-emerald-500/[0.05]'
              : 'border-white/[0.08] hover:border-white/[0.15] bg-[#0B0F19]'
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
              <p className="text-sm text-gray-400">Đang upload...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center">
                {dragOver ? <Upload className="w-6 h-6 text-emerald-400" /> : <ImageIcon className="w-6 h-6 text-gray-500" />}
              </div>
              <div>
                <p className="text-sm text-gray-300">
                  Kéo thả ảnh vào đây hoặc <span className="text-emerald-400">chọn file</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, WebP (tối đa 5MB)</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* URL input fallback */}
      <div className="mt-2 flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Hoặc nhập URL ảnh..."
          className="flex-1 bg-[#0B0F19] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-emerald-500/30"
        />
      </div>

      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

export default ImageUploader;
