import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import "@/styles/tiptap.css";
import { Plus, StarFour, ArrowsOutSimple } from "@phosphor-icons/react/dist/ssr";

 type TemplateType = "goal" | "scope" | "inScope" | "outScope" | "outcomes" | "feature";

 interface ProjectDescriptionEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  onExpandChange?: (isExpanded: boolean) => void;
  onFocusChange?: (isFocused: boolean) => void;
  placeholder?: string;
  className?: string;
  showTemplates?: boolean;
 }

 export function ProjectDescriptionEditor({
  value,
  onChange,
  onExpandChange,
  onFocusChange,
  placeholder,
  className,
  showTemplates = true,
 }: ProjectDescriptionEditorProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [existingSections, setExistingSections] = useState({
    goal: false,
    scope: false,
    outScope: false,
    outcomes: false,
    feature: false,
  });

  useEffect(() => {
    onFocusChange?.(isFocused);
  }, [isFocused, onFocusChange]);

  useEffect(() => {
    onExpandChange?.(isExpanded);
  }, [isExpanded, onExpandChange]);

  const defaultPlaceholder =
    placeholder ?? "Briefly describe the goal of this project/sprint...";

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: ({ node }: { node: any }) => {
          if (node.type.name === "heading") {
            return "Whats the title?";
          }
          return defaultPlaceholder;
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "tiptap-editor h-full w-full outline-none prose prose-sm max-w-none text-foreground",
      },
    },
    content: value,
    immediatelyRender: false,
    onFocus: () => setIsFocused(true),
    onUpdate: ({ editor }: { editor: any }) => {
      const text = editor.getText();
      setExistingSections({
        goal: text.includes("Goal:"),
        scope: text.includes("Scope:"),
        outScope: text.includes("Out of Scope:"),
        outcomes: text.includes("Expected Outcomes:"),
        feature: text.includes("Key feature:"),
      });
      onChange?.(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (value == null) return;
    const currentHtml = editor.getHTML();
    if (currentHtml === value) return;
    editor.commands.setContent(value);
  }, [value, editor]);

  // Handle click outside to reset focus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    if (isFocused) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFocused]);

  const handleInsertTemplate = (type: TemplateType) => {
    if (!editor) return;

    switch (type) {
      case "goal":
        editor
          .chain()
          .focus()
          .insertContent(
            "<p><strong>Goal:</strong></p><p>Write the primary goal here...</p>",
          )
          .run();
        break;
      case "scope":
        editor
          .chain()
          .focus()
          .insertContent([
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  marks: [{ type: "bold" }],
                  text: "Scope:",
                },
              ],
            },
            {
              type: "taskList",
              content: [
                {
                  type: "taskItem",
                  attrs: { checked: false },
                  content: [
                    {
                      type: "paragraph",
                      content: [
                        {
                          type: "text",
                          text: "In scope item 1",
                        },
                      ],
                    },
                  ],
                },
                {
                  type: "taskItem",
                  attrs: { checked: false },
                  content: [
                    {
                      type: "paragraph",
                      content: [
                        {
                          type: "text",
                          text: "In scope item 2",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ])
          .run();
        break;
      case "inScope":
        editor
          .chain()
          .focus()
          .insertContent([
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  marks: [{ type: "bold" }],
                  text: "Scope:",
                },
              ],
            },
            {
              type: "taskList",
              content: [
                {
                  type: "taskItem",
                  attrs: { checked: false },
                  content: [
                    {
                      type: "paragraph",
                      content: [
                        { type: "text", text: "In scope item" },
                      ],
                    },
                  ],
                },
              ],
            },
          ])
          .run();
        break;
      case "outScope":
        editor
          .chain()
          .focus()
          .insertContent([
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  marks: [{ type: "bold" }],
                  text: "Out of Scope:",
                },
              ],
            },
            {
              type: "taskList",
              content: [
                {
                  type: "taskItem",
                  attrs: { checked: false },
                  content: [{ type: "paragraph", content: [] }],
                },
              ],
            },
          ])
          .run();
        break;
      case "outcomes":
        editor
          .chain()
          .focus()
          .insertContent(
            "<p><strong>Expected Outcomes:</strong></p><ol><li><p></p></li></ol>",
          )
          .run();
        break;
      case "feature":
        editor
          .chain()
          .focus()
          .insertContent(
            "<p><strong>Key feature:</strong></p><ul><li><p></p></li></ul>",
          )
          .run();
        break;
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full rounded-lg group transition-all duration-300 ease-in-out flex flex-col overflow-hidden",
        isExpanded
          ? "flex-1 min-h-0"
          : isFocused
            ? "h-70 shrink-0"
            : "h-30 shrink-0",
        className,
      )}
    >
      {(isFocused || isExpanded) && (
        <div className="absolute border border-primary border-solid inset-0 pointer-events-none rounded-lg z-20" />
      )}

      <div
        className={cn(
          "size-full flex flex-col relative transition-colors",
          isFocused || isExpanded
            ? "p-3.5 gap-1 bg-background"
            : "bg-muted/10 hover:bg-muted/20 rounded-lg cursor-text",
        )}
        onClick={() => {
          if (!isFocused) {
            setIsFocused(true);
            editor?.commands.focus();
          }
        }}
      >
        <div
          className={cn(
            "flex grow relative w-full overflow-y-auto",
            isFocused || isExpanded ? "items-start" : "h-full items-center",
          )}
        >
          <div className="w-full h-full">
            <EditorContent editor={editor} className="h-full" />
          </div>

          {(isFocused || isExpanded) && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded((prev) => !prev);
              }}
              className="absolute top-0 right-0 p-2 opacity-50 hover:opacity-100 transition-opacity z-30"
              title={isExpanded ? "Collapse" : "Expand"}
            >
              <ArrowsOutSimple className="size-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {(isFocused || isExpanded) && (
          <div className="w-full overflow-hidden shrink-0 animate-in fade-in zoom-in-95 duration-200">
            <div className="h-px w-full bg-border my-2" />
            <div className="flex flex-wrap gap-2 items-center w-full">
              {showTemplates && (
                <>
                  {!existingSections.goal && (
                    <button
                      type="button"
                      onClick={() => handleInsertTemplate("goal")}
                      className="flex gap-1.5 items-center opacity-60 hover:opacity-100 hover:bg-muted/50 px-2 py-1 rounded transition-all"
                    >
                      <Plus className="size-3.5 text-muted-foreground" />
                      <span className="font-medium text-foreground text-xs">
                        Goal
                      </span>
                    </button>
                  )}

                  {!existingSections.scope && (
                    <button
                      type="button"
                      onClick={() => handleInsertTemplate("scope")}
                      className="flex gap-1.5 items-center opacity-60 hover:opacity-100 hover:bg-muted/50 px-2 py-1 rounded transition-all"
                    >
                      <Plus className="size-3.5 text-muted-foreground" />
                      <span className="font-medium text-foreground text-xs">
                        Scope
                      </span>
                    </button>
                  )}

                  {!existingSections.scope && (
                    <button
                      type="button"
                      onClick={() => handleInsertTemplate("inScope")}
                      className="flex gap-1.5 items-center opacity-60 hover:opacity-100 hover:bg-muted/50 px-2 py-1 rounded transition-all"
                    >
                      <Plus className="size-3.5 text-muted-foreground" />
                      <span className="font-medium text-foreground text-xs">
                        In scope
                      </span>
                    </button>
                  )}

                  {!existingSections.outcomes && (
                    <button
                      type="button"
                      onClick={() => handleInsertTemplate("outcomes")}
                      className="flex gap-1.5 items-center opacity-60 hover:opacity-100 hover:bg-muted/50 px-2 py-1 rounded transition-all"
                    >
                      <Plus className="size-3.5 text-muted-foreground" />
                      <span className="font-medium text-foreground text-xs">
                        Outcomes
                      </span>
                    </button>
                  )}

                  {!existingSections.outScope && (
                    <button
                      type="button"
                      onClick={() => handleInsertTemplate("outScope")}
                      className="flex gap-1.5 items-center opacity-60 hover:opacity-100 hover:bg-muted/50 px-2 py-1 rounded transition-all"
                    >
                      <Plus className="size-3.5 text-muted-foreground" />
                      <span className="font-medium text-foreground text-xs">
                        Out of scope
                      </span>
                    </button>
                  )}

                  {!existingSections.feature && (
                    <button
                      type="button"
                      onClick={() => handleInsertTemplate("feature")}
                      className="flex gap-1.5 items-center opacity-60 hover:opacity-100 hover:bg-muted/50 px-2 py-1 rounded transition-all"
                    >
                      <Plus className="size-3.5 text-muted-foreground" />
                      <span className="font-medium text-foreground text-xs">
                        Key feature
                      </span>
                    </button>
                  )}
                </>
              )}

              <div className="flex-1" />

              <div className="flex flex-col items-center justify-center ml-2">
                <button
                  type="button"
                  className="bg-muted-foreground/8 flex gap-1.5 h-7 items-center px-3 py-0.5 rounded-full hover:bg-muted-foreground/20 transition-colors cursor-pointer"
                >
                  <div className="size-3.5">
                    <StarFour
                      weight="fill"
                      className="size-3.5 text-primary"
                    />
                  </div>
                  <span className="font-medium text-foreground text-xs tracking-wide">
                    Write with AI
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
 }
