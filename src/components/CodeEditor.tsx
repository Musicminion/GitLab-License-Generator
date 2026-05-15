import CodeMirror, { EditorView } from '@uiw/react-codemirror'
import { json } from '@codemirror/lang-json'

interface Props {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  language?: 'json' | 'text'
  minHeight?: number
  maxHeight?: number
}

// Soft pink theme that matches the rest of the app.
const theme = EditorView.theme({
  '&': {
    fontSize: '13px',
    backgroundColor: '#fff8fb',
    borderRadius: '10px',
    border: '1px solid #ffd5e6',
  },
  '&.cm-focused': {
    outline: 'none',
    borderColor: '#ff6fa5',
    boxShadow: '0 0 0 2px rgba(255,111,165,0.15)',
  },
  '.cm-content': {
    fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace",
    padding: '10px 4px',
  },
  '.cm-gutters': {
    backgroundColor: '#fff0f6',
    color: '#d65a91',
    border: 'none',
    borderTopLeftRadius: '10px',
    borderBottomLeftRadius: '10px',
  },
  '.cm-selectionBackground, ::selection': { backgroundColor: '#ffd5e6 !important' },
  '.cm-placeholder': { color: '#cfa4b8' },
})

export default function CodeEditor({
  value,
  onChange,
  placeholder,
  language = 'text',
  minHeight = 160,
  maxHeight,
}: Props) {
  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      extensions={language === 'json' ? [json()] : []}
      theme={theme}
      basicSetup={{
        lineNumbers: true,
        highlightActiveLine: false,
        highlightActiveLineGutter: false,
        foldGutter: false,
        autocompletion: false,
        searchKeymap: false,
        bracketMatching: language === 'json',
      }}
      minHeight={`${minHeight}px`}
      maxHeight={maxHeight ? `${maxHeight}px` : undefined}
    />
  )
}
