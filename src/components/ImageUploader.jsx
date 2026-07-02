import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { getCroppedImg } from '../lib/cropImage'
import { supabase } from '../lib/supabase'

/**
 * Upload gambar + fitur crop/resize sebelum diunggah ke Supabase Storage.
 * bucket: nama bucket storage ("berita", "pengurus", "galeri")
 * aspect: rasio crop, mis. 16/9, 1/1, 4/3
 * onUploaded(publicUrl): dipanggil setelah upload berhasil
 */
export default function ImageUploader({ bucket, aspect = 16 / 9, onUploaded }) {
  const [rawImage, setRawImage] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const onFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    const reader = new FileReader()
    reader.onload = () => setRawImage(reader.result)
    reader.readAsDataURL(file)
  }

  const onCropComplete = useCallback((_, pixels) => setCroppedAreaPixels(pixels), [])

  const handleUpload = async () => {
    if (!rawImage || !croppedAreaPixels) return
    setUploading(true)
    setError('')
    try {
      const blob = await getCroppedImg(rawImage, croppedAreaPixels)
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`

      const { error: upErr } = await supabase.storage.from(bucket).upload(fileName, blob, {
        contentType: 'image/jpeg',
        upsert: false,
      })
      if (upErr) throw upErr

      const { data } = supabase.storage.from(bucket).getPublicUrl(fileName)
      onUploaded?.(data.publicUrl)
      setRawImage(null)
      setZoom(1)
      setCrop({ x: 0, y: 0 })
    } catch (err) {
      setError(err.message || 'Gagal mengunggah gambar.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      <input
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-emerald file:text-cream file:px-4 file:py-2 file:text-sm file:font-medium hover:file:bg-emerald-light"
      />

      {rawImage && (
        <div className="space-y-3">
          <div className="relative w-full h-72 bg-ink/90 rounded-xl overflow-hidden">
            <Cropper
              image={rawImage}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-ink/70">Ukuran</label>
            <input
              type="range" min={1} max={3} step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 accent-gold"
            />
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading}
              className="rounded-full bg-gold text-emerald-dark font-semibold px-4 py-2 text-sm disabled:opacity-50"
            >
              {uploading ? 'Mengunggah...' : 'Simpan Foto'}
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
