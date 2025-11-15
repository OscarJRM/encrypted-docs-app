"use client";

import { useEffect, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Code,
  Code2,
  CornerDownLeft,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Eraser,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  List,
  ListOrdered,
  Minus,
  Pilcrow,
  Quote,
  Redo,
  Strikethrough,
  Link2,
  Unlink,
  ImageIcon,
  Underline,
  Undo,
} from "lucide-react";

import { Button } from "@/app/components/ui/button";
import { cn } from "@/app/lib/utils";
import {
  HighlightMark,
  UnderlineMark,
} from "../extensions/custom-marks";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  id?: string;
};

export function RichTextEditor({ value, onChange, id }: RichTextEditorProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        linkOnPaste: true,
        HTMLAttributes: {
          class: "text-primary underline underline-offset-4",
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: "my-4 rounded-2xl shadow-[var(--shadow-card)] max-w-full",
        },
      }),
      UnderlineMark,
      HighlightMark,
    ],
    content: value || "<p></p>",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "tiptap min-h-[240px] rounded-xl border border-border/40 bg-background/60 px-4 py-3 text-base transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value && value !== current) {
      editor.commands.setContent(value, false);
    }
    if (!value && current !== "<p></p>") {
      editor.commands.clearContent();
    }
  }, [value, editor]);

  const insertLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Ingresa la URL", previousUrl ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const removeLink = () => {
    editor?.chain().focus().unsetLink().run();
  };

  const onSelectImage = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !editor) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      editor
        .chain()
        .focus()
        .setImage({ src: result, alt: file.name || "Imagen" })
        .run();
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const controls = [
    {
      label: "Negrita",
      icon: Bold,
      action: () => editor?.chain().focus().toggleBold().run(),
      isActive: () => editor?.isActive("bold"),
      canRun: () => editor?.can().chain().focus().toggleBold().run(),
    },
    {
      label: "Itálica",
      icon: Italic,
      action: () => editor?.chain().focus().toggleItalic().run(),
      isActive: () => editor?.isActive("italic"),
      canRun: () => editor?.can().chain().focus().toggleItalic().run(),
    },
    {
      label: "Subrayado",
      icon: Underline,
      action: () => editor?.chain().focus().toggleUnderline().run(),
      isActive: () => editor?.isActive("underline"),
      canRun: () => editor?.can().chain().focus().toggleUnderline().run(),
    },
    {
      label: "Tachado",
      icon: Strikethrough,
      action: () => editor?.chain().focus().toggleStrike().run(),
      isActive: () => editor?.isActive("strike"),
      canRun: () => editor?.can().chain().focus().toggleStrike().run(),
    },
    {
      label: "Resalto",
      icon: Highlighter,
      action: () => editor?.chain().focus().toggleHighlight().run(),
      isActive: () => editor?.isActive("highlight"),
      canRun: () => editor?.can().chain().focus().toggleHighlight().run(),
    },
    {
      label: "Encabezado grande",
      icon: Heading1,
      action: () =>
        editor?.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor?.isActive("heading", { level: 1 }),
      canRun: () =>
        editor?.can().chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      label: "Encabezado mediano",
      icon: Heading2,
      action: () =>
        editor?.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor?.isActive("heading", { level: 2 }),
      canRun: () =>
        editor?.can().chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      label: "Encabezado pequeño",
      icon: Heading3,
      action: () =>
        editor?.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: () => editor?.isActive("heading", { level: 3 }),
      canRun: () =>
        editor?.can().chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      label: "Párrafo",
      icon: Pilcrow,
      action: () => editor?.chain().focus().setParagraph().run(),
      isActive: () => editor?.isActive("paragraph"),
      canRun: () => editor?.can().chain().focus().setParagraph().run(),
    },
    {
      label: "Lista",
      icon: List,
      action: () => editor?.chain().focus().toggleBulletList().run(),
      isActive: () => editor?.isActive("bulletList"),
      canRun: () => editor?.can().chain().focus().toggleBulletList().run(),
    },
    {
      label: "Lista numerada",
      icon: ListOrdered,
      action: () => editor?.chain().focus().toggleOrderedList().run(),
      isActive: () => editor?.isActive("orderedList"),
      canRun: () => editor?.can().chain().focus().toggleOrderedList().run(),
    },
    {
      label: "Cita",
      icon: Quote,
      action: () => editor?.chain().focus().toggleBlockquote().run(),
      isActive: () => editor?.isActive("blockquote"),
      canRun: () => editor?.can().chain().focus().toggleBlockquote().run(),
    },
    {
      label: "Código inline",
      icon: Code,
      action: () => editor?.chain().focus().toggleCode().run(),
      isActive: () => editor?.isActive("code"),
      canRun: () => editor?.can().chain().focus().toggleCode().run(),
    },
    {
      label: "Bloque de código",
      icon: Code2,
      action: () => editor?.chain().focus().toggleCodeBlock().run(),
      isActive: () => editor?.isActive("codeBlock"),
      canRun: () => editor?.can().chain().focus().toggleCodeBlock().run(),
    },
    {
      label: "Separador",
      icon: Minus,
      action: () => editor?.chain().focus().setHorizontalRule().run(),
      isActive: () => false,
      canRun: () => editor?.can().chain().focus().setHorizontalRule().run(),
    },
    {
      label: "Salto de línea",
      icon: CornerDownLeft,
      action: () => editor?.chain().focus().setHardBreak().run(),
      isActive: () => false,
      canRun: () => editor?.can().chain().focus().setHardBreak().run(),
    },
    {
      label: "Alinear izquierda",
      icon: AlignLeft,
      action: () => editor?.chain().focus().setTextAlign("left").run(),
      isActive: () => editor?.isActive({ textAlign: "left" }),
      canRun: () => editor?.can().chain().focus().setTextAlign("left").run(),
    },
    {
      label: "Centrar",
      icon: AlignCenter,
      action: () => editor?.chain().focus().setTextAlign("center").run(),
      isActive: () => editor?.isActive({ textAlign: "center" }),
      canRun: () => editor?.can().chain().focus().setTextAlign("center").run(),
    },
    {
      label: "Alinear derecha",
      icon: AlignRight,
      action: () => editor?.chain().focus().setTextAlign("right").run(),
      isActive: () => editor?.isActive({ textAlign: "right" }),
      canRun: () => editor?.can().chain().focus().setTextAlign("right").run(),
    },
    {
      label: "Justificar",
      icon: AlignJustify,
      action: () => editor?.chain().focus().setTextAlign("justify").run(),
      isActive: () => editor?.isActive({ textAlign: "justify" }),
      canRun: () => editor?.can().chain().focus().setTextAlign("justify").run(),
    },
    {
      label: "Deshacer",
      icon: Undo,
      action: () => editor?.chain().focus().undo().run(),
      isActive: () => false,
      canRun: () => editor?.can().chain().focus().undo().run(),
    },
    {
      label: "Rehacer",
      icon: Redo,
      action: () => editor?.chain().focus().redo().run(),
      isActive: () => false,
      canRun: () => editor?.can().chain().focus().redo().run(),
    },
    {
      label: "Limpiar formato",
      icon: Eraser,
      action: () =>
        editor
          ?.chain()
          .focus()
          .unsetAllMarks()
          .clearNodes()
          .run(),
      isActive: () => false,
      canRun: () => !!editor,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-border/40 bg-muted/30 p-3">
        <div className="flex flex-wrap justify-center gap-1">
          {controls.map(({ label, icon: Icon, action, isActive, canRun }) => (
            <Button
              key={label}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => action?.()}
              disabled={!editor || canRun?.() === false}
              className={cn(
                "text-muted-foreground",
                isActive?.()
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-primary/5 hover:text-foreground"
              )}
            >
              <Icon className="size-4" />
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={!editor}
            onClick={insertLink}
            className="text-muted-foreground hover:bg-primary/5 hover:text-foreground"
          >
            <Link2 className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={!editor}
            onClick={removeLink}
            className="text-muted-foreground hover:bg-primary/5 hover:text-foreground"
          >
            <Unlink className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={!editor}
            onClick={() => imageInputRef.current?.click()}
            className="text-muted-foreground hover:bg-primary/5 hover:text-foreground"
          >
            <ImageIcon className="size-4" />
          </Button>
        </div>
      </div>
      <div className="rounded-2xl bg-card/40 p-2">
        <EditorContent id={id} editor={editor} />
      </div>
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={onSelectImage}
        className="hidden"
      />
    </div>
  );
}
