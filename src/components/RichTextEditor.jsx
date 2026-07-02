import { useMemo } from 'react'
import ReactQuill, { Quill } from 'react-quill'
import 'react-quill/dist/quill.snow.css'

// Format kustom "uppercase" mirip Word: bungkus teks jadi huruf kapital via CSS,
// teks asli tersimpan apa adanya (lebih aman utk pencarian/SEO).
const Inline = Quill.import('blots/inline')
class UppercaseBlot extends Inline {}
UppercaseBlot.blotName = 'upper'
UppercaseBlot.tagName = 'span'
UppercaseBlot.className = 'ql-upper'
Quill.register(UppercaseBlot)

const toolbarOptions = [
  [{ header: [1, 2, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  ['upper'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ align: [] }],
  ['blockquote', 'link', 'image'],
  ['clean'],
]

/**
 * Editor redaksi berita ala Microsoft Word: bold, italic, heading 1/2,
 * uppercase, list, align, quote, link, image.
 */
export default function RichTextEditor({ value, onChange, placeholder }) {
  const modules = useMemo(
    () => ({
      toolbar: {
        container: toolbarOptions,
        handlers: {
          upper: function () {
            const range = this.quill.getSelection()
            if (!range || range.length === 0) return
            const current = this.quill.getFormat(range)
            this.quill.formatText(range.index, range.length, 'upper', !current.upper)
          },
        },
      },
    }),
    []
  )

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-emerald/15">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder || 'Tulis isi berita di sini...'}
      />
    </div>
  )
}
