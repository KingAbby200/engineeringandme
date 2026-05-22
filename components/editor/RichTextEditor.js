'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { TextStyle, FontSize } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import { Node } from '@tiptap/core';
import { useState, useCallback, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code, Link2, Image as ImageIcon,
  AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Quote, Minus, Undo, Redo,
  Heading1, Heading2, Heading3, FileCode, Highlighter, Type, Palette
} from 'lucide-react';

const ToolbarButton = ({ onClick, active, title, children, disabled }) => (
  <button
    type="button"
    onMouseDown={(e) => { e.preventDefault(); onClick(); }}
    disabled={disabled}
    title={title}
    style={{
      padding: '0.3rem 0.4rem', borderRadius: 4, border: 'none',
      background: active ? '#f0fdf4' : 'transparent',
      color: active ? '#16a34a' : '#374151',
      cursor: disabled ? 'not-allowed' : 'pointer', fontSize: '0.875rem',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      opacity: disabled ? 0.5 : 1, transition: 'background 0.1s, color 0.1s',
    }}
  >
    {children}
  </button>
);

const Separator = () => <div style={{ width: 1, background: '#e5e7eb', margin: '0 0.25rem', alignSelf: 'stretch' }} />;

// Custom math node for LaTeX rendering
const MathNode = Node.create({
  name: 'math',
  group: 'inline',
  content: 'text*',
  marks: '',
  inline: true,
  atom: true,
  addAttributes() {
    return { latex: { default: '' }, isBlock: { default: false } };
  },
  parseHTML() {
    return [
      { tag: 'span[data-math]', getAttrs: el => ({ latex: el.getAttribute('data-math'), isBlock: el.classList.contains('math-block') }) },
    ];
  },
  renderHTML({ node }) {
    const attrs = { 'data-math': node.attrs.latex, class: node.attrs.isBlock ? 'math-block' : 'math-inline', contenteditable: 'false' };
    return ['span', attrs, `$$${node.attrs.latex}$$`];
  },
});

export default function RichTextEditor({ content, onChange, placeholder = 'Start writing your tutorial content...' }) {
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const fileInputRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image.configure({ resizable: true, allowBase64: true }),
      Link.configure({ openOnClick: false, autolink: true }),
      MathNode,
    ],
    content: content || '',
    onUpdate: ({ editor }) => { 
      onChange && onChange(editor.getHTML()); 
      setTimeout(() => renderMathInContent(), 0);
    },
    editorProps: {
      attributes: { class: 'tutorial-content', style: 'min-height: 400px; outline: none; padding: 1rem;' },
      handlePaste: (view, event) => {
        const items = Array.from(event.clipboardData?.items || []);
        for (const item of items) {
          if (item.type.includes('image')) {
            event.preventDefault();
            const blob = item.getAsFile();
            const reader = new FileReader();
            reader.onload = (e) => {
              view.dispatch(view.state.tr.replaceSelectionWith(view.state.schema.nodes.image.create({ src: e.target.result })));
            };
            reader.readAsDataURL(blob);
          }
        }
      },
    },
  });

  // Load and render KaTeX when content updates
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.katexLoaded) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.js';
      script.onload = () => {
        window.katexLoaded = true;
        renderMathInContent();
      };
      document.head.appendChild(script);
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css';
      document.head.appendChild(link);
    } else if (window.katexLoaded) {
      renderMathInContent();
    }
  }, []);

  const renderMathInContent = () => {
    if (typeof window !== 'undefined' && window.katex) {
      const mathElements = document.querySelectorAll('[data-math]');
      mathElements.forEach(el => {
        try {
          const latex = el.getAttribute('data-math');
          el.innerHTML = '';
          window.katex.render(latex, el, { throwOnError: false, displayMode: el.classList.contains('math-block') });
        } catch (e) {
          console.error('KaTeX render error:', e);
        }
      });
    }
  };

  const uploadImage = useCallback(async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'tutorial-content');
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        editor?.chain().focus().setImage({ src: data.url, alt: file.name }).run();
        toast.success('Image uploaded');
      } else toast.error(data.error || 'Upload failed');
    } catch { toast.error('Upload failed'); }
  }, [editor]);

  const handleImageUpload = () => fileInputRef.current?.click();

  const insertLink = () => {
    if (!linkUrl) { editor?.chain().focus().unsetLink().run(); }
    else { editor?.chain().focus().setLink({ href: linkUrl }).run(); }
    setShowLinkInput(false);
    setLinkUrl('');
  };

  const insertMath = () => {
    const expr = prompt('Enter LaTeX expression:\n\nExample: E = mc^2\nFor fractions: \\frac{x}{y}\nFor subscripts: x_0\nFor superscripts: x^2');
    if (expr) {
      editor?.chain().focus().insertContent({
        type: 'math',
        attrs: { latex: expr, isBlock: false },
      }).run();
      renderMathInContent();
    }
  };

  if (!editor) return null;

  const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px'];
  const COLORS = ['#111827', '#16a34a', '#2563eb', '#dc2626', '#d97706', '#7c3aed', '#db2777', '#0891b2', '#059669', '#64748b'];

  return (
    <div style={{ border: '1.5px solid #e5e7eb', borderRadius: 8, overflow: 'hidden', background: 'white' }}>
      {/* Toolbar */}
      <div className="editor-toolbar" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.15rem', padding: '0.5rem 0.75rem', borderBottom: '1px solid #e5e7eb', background: '#f9fafb', position: 'sticky', top: 0, zIndex: 10 }}>

        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo"><Undo size={15} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo"><Redo size={15} /></ToolbarButton>
        <Separator />

        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Heading 1"><Heading1 size={15} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2"><Heading2 size={15} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3"><Heading3 size={15} /></ToolbarButton>
        <Separator />

        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold"><Bold size={15} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic"><Italic size={15} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline"><UnderlineIcon size={15} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough"><Strikethrough size={15} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive('highlight')} title="Highlight"><Highlighter size={15} /></ToolbarButton>
        <Separator />

        {/* Font size */}
        <select
          onChange={(e) => editor.chain().focus().setMark('textStyle', { fontSize: e.target.value }).run()}
          defaultValue=""
          style={{ padding: '0.25rem', border: '1px solid #e5e7eb', borderRadius: 4, fontSize: '0.8rem', cursor: 'pointer', background: 'white', color: '#374151' }}
          title="Font size"
        >
          <option value="" disabled>Size</option>
          {FONT_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Color picker */}
        <div style={{ position: 'relative' }}>
          <ToolbarButton onClick={() => setShowColorPicker(!showColorPicker)} title="Text color">
            <Palette size={15} />
          </ToolbarButton>
          {showColorPicker && (
            <div style={{ position: 'absolute', top: '100%', left: 0, background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, padding: '0.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 100, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.3rem', width: 140 }}>
              {COLORS.map(color => (
                <button key={color} type="button" onClick={() => { editor.chain().focus().setColor(color).run(); setShowColorPicker(false); }}
                  style={{ width: 22, height: 22, borderRadius: '50%', background: color, border: '2px solid white', cursor: 'pointer', boxShadow: '0 0 0 1px #e5e7eb' }} />
              ))}
            </div>
          )}
        </div>
        <Separator />

        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Left"><AlignLeft size={15} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Center"><AlignCenter size={15} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Right"><AlignRight size={15} /></ToolbarButton>
        <Separator />

        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list"><List size={15} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered list"><ListOrdered size={15} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Quote"><Quote size={15} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline code"><Code size={15} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code block"><FileCode size={15} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider"><Minus size={15} /></ToolbarButton>
        <Separator />

        {/* Link */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <ToolbarButton onClick={() => setShowLinkInput(!showLinkInput)} active={editor.isActive('link')} title="Link"><Link2 size={15} /></ToolbarButton>
          {showLinkInput && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <input value={linkUrl} onChange={e => setLinkUrl(e.target.value)} placeholder="https://..." onKeyDown={e => e.key === 'Enter' && insertLink()}
                style={{ padding: '0.25rem 0.5rem', border: '1.5px solid #16a34a', borderRadius: 4, fontSize: '0.8rem', outline: 'none', width: 180 }} autoFocus />
              <button type="button" onClick={insertLink} style={{ padding: '0.25rem 0.5rem', background: '#16a34a', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: '0.8rem' }}>Add</button>
            </div>
          )}
        </div>

        {/* Image */}
        <ToolbarButton onClick={handleImageUpload} title="Insert image"><ImageIcon size={15} /></ToolbarButton>

        {/* Math */}
        <ToolbarButton onClick={insertMath} title="Insert math expression">
          <span style={{ fontSize: '0.7rem', fontWeight: 700, fontFamily: 'serif' }}>∑</span>
        </ToolbarButton>
      </div>

      {/* Editor area */}
      <EditorContent editor={editor} />

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }}
        onChange={e => { const file = e.target.files?.[0]; if (file) uploadImage(file); e.target.value = ''; }} />
    </div>
  );
}
