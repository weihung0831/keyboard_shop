'use client';

/**
 * 富文字編輯器元件 — 基於 TipTap
 */

import { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle, Color } from '@tiptap/extension-text-style';
import { Highlight } from '@tiptap/extension-highlight';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Undo,
  Redo,
  RemoveFormatting,
  Palette,
  Highlighter,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const TEXT_COLORS = [
  { label: '預設', value: '' },
  { label: '藍色', value: '#60a5fa' },
  { label: '綠色', value: '#4ade80' },
  { label: '紅色', value: '#f87171' },
  { label: '黃色', value: '#facc15' },
  { label: '紫色', value: '#c084fc' },
  { label: '橘色', value: '#fb923c' },
  { label: '白色', value: '#ffffff' },
  { label: '灰色', value: '#a1a1aa' },
];

const HIGHLIGHT_COLORS = [
  { label: '無', value: '' },
  { label: '黃色', value: '#facc15' },
  { label: '綠色', value: '#4ade80' },
  { label: '藍色', value: '#60a5fa' },
  { label: '紅色', value: '#f87171' },
  { label: '紫色', value: '#c084fc' },
];

function ToolbarButton({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      title={title}
      className={cn(
        'p-1.5 rounded transition-colors',
        active
          ? 'bg-blue-600/20 text-blue-400'
          : 'text-zinc-400 hover:text-white hover:bg-zinc-700',
      )}
    >
      {children}
    </button>
  );
}

function ColorPicker({
  colors,
  currentColor,
  onSelect,
  onClose,
}: {
  colors: { label: string; value: string }[];
  currentColor: string;
  onSelect: (color: string) => void;
  onClose: () => void;
}) {
  return (
    <div className='absolute top-full left-0 mt-1 bg-zinc-900 border border-zinc-700 rounded-lg p-2 shadow-xl z-50 min-w-[160px]'>
      <div className='flex flex-wrap gap-1.5'>
        {colors.map(c => (
          <button
            key={c.label}
            type='button'
            onClick={() => {
              onSelect(c.value);
              onClose();
            }}
            title={c.label}
            className={cn(
              'w-6 h-6 rounded border transition-transform hover:scale-110',
              currentColor === c.value ? 'border-blue-400 ring-1 ring-blue-400' : 'border-zinc-600',
            )}
            style={{
              backgroundColor: c.value || '#27272a',
            }}
          >
            {!c.value && <span className='text-zinc-500 text-xs'>✕</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

export function RichTextEditor({ value, onChange }: Props) {
  const [showTextColor, setShowTextColor] = useState(false);
  const [showHighlight, setShowHighlight] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit, TextStyle, Color, Highlight.configure({ multicolor: true })],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'px-3 py-2 min-h-[120px] focus:outline-none text-zinc-300 text-sm',
      },
    },
    onUpdate: ({ editor: e }) => {
      onChange(e.getHTML());
    },
  });

  const initialized = useRef(false);
  useEffect(() => {
    if (editor && value && !initialized.current) {
      const cur = editor.getHTML();
      if (cur === '<p></p>' || cur === '') {
        editor.commands.setContent(value);
        initialized.current = true;
      }
    }
  }, [editor, value]);

  if (!editor) return null;

  const currentTextColor = editor.getAttributes('textStyle').color || '';

  return (
    <div className='bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden focus-within:border-blue-500'>
      {/* Toolbar */}
      <div className='flex items-center gap-0.5 px-2 py-1.5 border-b border-zinc-700 bg-zinc-950/50 flex-wrap'>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title='標題'
        >
          <Heading2 className='h-4 w-4' />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title='粗體'
        >
          <Bold className='h-4 w-4' />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title='斜體'
        >
          <Italic className='h-4 w-4' />
        </ToolbarButton>

        <div className='w-px h-4 bg-zinc-700 mx-1' />

        {/* Text color */}
        <div className='relative'>
          <ToolbarButton
            onClick={() => {
              setShowTextColor(!showTextColor);
              setShowHighlight(false);
            }}
            active={!!currentTextColor}
            title='文字顏色'
          >
            <Palette className='h-4 w-4' />
          </ToolbarButton>
          {showTextColor && (
            <ColorPicker
              colors={TEXT_COLORS}
              currentColor={currentTextColor}
              onSelect={color => {
                if (color) {
                  editor.chain().focus().setColor(color).run();
                } else {
                  editor.chain().focus().unsetColor().run();
                }
              }}
              onClose={() => setShowTextColor(false)}
            />
          )}
        </div>

        {/* Highlight */}
        <div className='relative'>
          <ToolbarButton
            onClick={() => {
              setShowHighlight(!showHighlight);
              setShowTextColor(false);
            }}
            active={editor.isActive('highlight')}
            title='螢光標記'
          >
            <Highlighter className='h-4 w-4' />
          </ToolbarButton>
          {showHighlight && (
            <ColorPicker
              colors={HIGHLIGHT_COLORS}
              currentColor={editor.getAttributes('highlight').color || ''}
              onSelect={color => {
                if (color) {
                  editor.chain().focus().toggleHighlight({ color }).run();
                } else {
                  editor.chain().focus().unsetHighlight().run();
                }
              }}
              onClose={() => setShowHighlight(false)}
            />
          )}
        </div>

        <div className='w-px h-4 bg-zinc-700 mx-1' />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title='無序列表'
        >
          <List className='h-4 w-4' />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title='有序列表'
        >
          <ListOrdered className='h-4 w-4' />
        </ToolbarButton>

        <div className='w-px h-4 bg-zinc-700 mx-1' />

        <ToolbarButton
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          title='清除格式'
        >
          <RemoveFormatting className='h-4 w-4' />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title='復原'>
          <Undo className='h-4 w-4' />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title='重做'>
          <Redo className='h-4 w-4' />
        </ToolbarButton>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />

      {/* Scoped editor styles */}
      <style jsx global>{`
        .ProseMirror h2 {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 1rem 0 0.5rem;
          color: #60a5fa;
        }
        .ProseMirror ul {
          list-style: disc;
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        .ProseMirror ol {
          list-style: decimal;
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        .ProseMirror li {
          margin: 0.15rem 0;
        }
        .ProseMirror p {
          margin: 0.5rem 0;
        }
        .ProseMirror mark {
          border-radius: 2px;
          padding: 0 2px;
        }
      `}</style>
    </div>
  );
}
