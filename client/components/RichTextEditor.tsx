import { useEffect, useMemo, useRef, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Underline as UnderlineIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  className?: string;
};

export function RichTextEditor({ value, onChange, className }: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const extensions = useMemo(
    () => [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          loading: 'lazy',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    [],
  );

  const editor = useEditor({
    extensions,
    content: value || '<p></p>',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-slate max-w-none focus:outline-none min-h-[320px] px-4 py-3',
      },
    },
  });

  useEffect(() => {
    if (!editor) return;

    const current = editor.getHTML();
    if (current === (value || '<p></p>')) return;

    editor.commands.setContent(value || '<p></p>', { emitUpdate: false });
  }, [editor, value]);

  useEffect(() => {
    if (!editor) return;

    if (linkUrl === null) return;

    const url = linkUrl.trim();

    if (!url) {
      editor.chain().focus().unsetLink().run();
      setLinkUrl(null);
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    setLinkUrl(null);
  }, [editor, linkUrl]);

  if (!editor) {
    return (
      <div className={cn('border border-border rounded-lg bg-white', className)}>
        <div className="p-4 text-sm text-foreground/60">Carregando editor...</div>
      </div>
    );
  }

  const ToolbarBtn = ({
    onClick,
    active,
    disabled,
    children,
  }: {
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
  }) => (
    <Button
      type="button"
      variant={active ? 'secondary' : 'ghost'}
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className="h-8 px-2"
    >
      {children}
    </Button>
  );

  const setLink = () => {
    const previous = editor.getAttributes('link').href as string | undefined;
    const next = window.prompt('Cole a URL do link:', previous || '');
    if (next === null) return;
    setLinkUrl(next);
  };

  const handleInlineImageUpload = async (file: File) => {
    if (!file) return;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `posts/inline/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('cms-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from('cms-images').getPublicUrl(filePath);

      editor
        .chain()
        .focus()
        .setImage({
          src: publicUrl,
          alt: file.name,
        })
        .run();
    } finally {
      setUploadingImage(false);
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  return (
    <div className={cn('border border-border rounded-lg bg-white overflow-hidden', className)}>
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-secondary/30 p-2">
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
        >
          H2
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
        >
          H3
        </ToolbarBtn>

        <div className="mx-1 h-6 w-px bg-border" />

        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          disabled={!editor.can().chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
        >
          <UnderlineIcon className="h-4 w-4" />
        </ToolbarBtn>

        <div className="mx-1 h-6 w-px bg-border" />

        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
        >
          <List className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarBtn>

        <div className="mx-1 h-6 w-px bg-border" />

        <ToolbarBtn onClick={setLink} active={editor.isActive('link')}>
          <LinkIcon className="h-4 w-4" />
        </ToolbarBtn>

        <ToolbarBtn
          onClick={() => imageInputRef.current?.click()}
          disabled={uploadingImage}
        >
          <ImageIcon className="h-4 w-4" />
        </ToolbarBtn>

        <div className="mx-1 h-6 w-px bg-border" />

        <ToolbarBtn
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          active={editor.isActive({ textAlign: 'left' })}
        >
          <AlignLeft className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          active={editor.isActive({ textAlign: 'center' })}
        >
          <AlignCenter className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          active={editor.isActive({ textAlign: 'right' })}
        >
          <AlignRight className="h-4 w-4" />
        </ToolbarBtn>
      </div>

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          void handleInlineImageUpload(file);
        }}
      />

      <EditorContent editor={editor} />
    </div>
  );
}
