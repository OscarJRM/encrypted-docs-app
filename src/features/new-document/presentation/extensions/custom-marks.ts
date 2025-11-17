"use client";

import { Mark, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    underline: {
      setUnderline: () => ReturnType;
      toggleUnderline: () => ReturnType;
      unsetUnderline: () => ReturnType;
    };
    highlight: {
      setHighlight: (attributes?: Record<string, unknown>) => ReturnType;
      toggleHighlight: () => ReturnType;
      unsetHighlight: () => ReturnType;
    };
  }
}

export const UnderlineMark = Mark.create({
  name: "underline",

  parseHTML() {
    return [
      { tag: "u" },
      { style: "text-decoration=underline" },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, { style: "text-decoration: underline" }),
      0,
    ];
  },

  addCommands() {
    return {
      toggleUnderline:
        () =>
        ({ commands }) =>
          commands.toggleMark(this.name),
    };
  },
});

export const HighlightMark = Mark.create({
  name: "highlight",

  addOptions() {
    return {
      HTMLAttributes: { class: "bg-primary/20 text-foreground" },
    };
  },

  parseHTML() {
    return [{ tag: "mark" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["mark", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },

  addCommands() {
    return {
      toggleHighlight:
        () =>
        ({ commands }) =>
          commands.toggleMark(this.name),
    };
  },
});
