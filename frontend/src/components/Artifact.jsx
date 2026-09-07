// 

import React, { useState } from "react";
import { AnimatePresence, easeInOut, motion } from "motion/react";
import {
  PanelRightClose,
  Code2,
  PanelRightOpen,
  Copy,
  Eye,
  Check,
} from "lucide-react";
import { useSelector } from "react-redux";
import Editor from "@monaco-editor/react";

const Artifact = () => {
  const { artifacts } = useSelector((state) => state.message);
  const [isMobileOpen,setIsMobileOpen]=useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [tab, setTab] = useState("code");
  const [activeFile, setActiveFile] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!artifacts || artifacts.length === 0) {
    return null;
  }

  const files = artifacts[0]?.files || [];

  const file = files[activeFile];

  const htmlFile = files.find(
    (f) => f.name?.toLowerCase() === "index.html"
  );

  const cssFile = files.find(
    (f) => f.name?.toLowerCase() === "style.css"
  );

  const jsFile = files.find(
    (f) => f.name?.toLowerCase() === "script.js"
  );

  const canPreview = Boolean(htmlFile);


  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(file?.content || "");

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };


  const previewDoc = `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <style>
    ${cssFile?.content || ""}
  </style>
</head>

<body>

  ${htmlFile?.content || ""}

  <script>
    ${jsFile?.content || ""}
  <\/script>

</body>

</html>
`;


  const detectLanguage = (filename = "") => {
    const name = filename.toLowerCase();

    if (name.endsWith(".html")) {
      return "html";
    }

    if (name.endsWith(".css")) {
      return "css";
    }

    if (name.endsWith(".js")) {
      return "javascript";
    }

    if (name.endsWith(".jsx")) {
      return "javascript";
    }

    if (name.endsWith(".ts")) {
      return "typescript";
    }

    if (name.endsWith(".tsx")) {
      return "typescript";
    }

    if (name.endsWith(".json")) {
      return "json";
    }

    if (name.endsWith(".py")) {
      return "python";
    }

    if (name.endsWith(".java")) {
      return "java";
    }

    if (name.endsWith(".cpp")) {
      return "cpp";
    }

    if (name.endsWith(".c")) {
      return "c";
    }

    return "plaintext";
  };


  const PanelContent =()=>{
    return (
      <>
              {!collapsed ? (
        <div className="flex flex-col h-full min-h-0 bg-[#0d0f14]">

          {/* HEADER */}
          <div
            className="
              h-14
              px-4
              border-b
              border-white/6
              flex
              items-center
              gap-3
              shrink-0
            "
          >
            <button
              className="
                flex
                items-center
                justify-center
                w-7
                h-7
                rounded-lg
                text-slate-500
                hover:text-slate-200
                hover:bg-white/5
                transition-colors
                duration-150
                bg-transparent
                border-none
                cursor-pointer
                shrink-0
              "
              onClick={() => setCollapsed(true)}
            >
              <PanelRightClose size={16} />
            </button>

            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div
                className="
                  flex
                  items-center
                  justify-center
                  w-6
                  h-6
                  rounded-md
                  bg-indigo-500/10
                  border
                  border-indigo-500/20
                  shrink-0
                "
              >
                <Code2
                  className="text-indigo-400"
                  size={16}
                />
              </div>

              <div
                className="
                  text-[13px]
                  font-medium
                  text-slate-200
                  truncate
                "
              >
                {artifacts[0]?.title}
              </div>
            </div>

            {/* COPY */}
            <button
              className="
                flex
                items-center
                justify-center
                w-8
                h-8
                text-slate-400
                hover:text-slate-200
                hover:bg-white/5
                rounded-lg
                transition-colors
                bg-transparent
                border-none
                cursor-pointer
              "
              onClick={handleCopyCode}
            >
              {copied ? (
                <Check size={15} />
              ) : (
                <Copy size={15} />
              )}
            </button>

            {/* CODE / PREVIEW */}
            {canPreview && (
              <div
                className="
                  flex
                  items-center
                  gap-1
                  bg-white/4
                  border
                  border-white/6
                  p-1
                  rounded-lg
                "
              >
                <button
                  className={`
                    flex
                    items-center
                    gap-1.5
                    px-2.5
                    py-1
                    text-[11px]
                    font-medium
                    rounded-md
                    transition-colors
                    ${
                      tab === "code"
                        ? "bg-indigo-500 text-white"
                        : "text-slate-500 hover:text-slate-200"
                    }
                  `}
                  onClick={() => setTab("code")}
                >
                  <Code2 size={11} />
                  Code
                </button>

                <button
                  className={`
                    flex
                    items-center
                    gap-1.5
                    px-2.5
                    py-1
                    text-[11px]
                    font-medium
                    rounded-md
                    transition-colors
                    ${
                      tab === "preview"
                        ? "bg-indigo-500 text-white"
                        : "text-slate-500 hover:text-slate-200"
                    }
                  `}
                  onClick={() => setTab("preview")}
                >
                  <Eye size={11} />
                  Preview
                </button>
              </div>
            )}
          </div>

          {/* FILE TABS */}
          {tab === "code" && (
            <div
              className="
                flex
                border-b
                border-white/6
                overflow-x-auto
                shrink-0
                scrollbar-none
              "
            >
              {files.map((f, index) => (
                <button
                  key={`${f.name}-${index}`}
                  className={`
                    px-4
                    py-2.5
                    text-[11px]
                    font-medium
                    whitespace-nowrap
                    transition-colors
                    duration-150
                    border-r
                    border-white/5
                    relative
                    cursor-pointer
                    bg-transparent
                    ${
                      activeFile === index
                        ? "text-indigo-400"
                        : "text-slate-500 hover:text-slate-300"
                    }
                  `}
                  onClick={() => setActiveFile(index)}
                >
                  {f?.name}

                  {activeFile === index && (
                    <div
                      className="
                        absolute
                        bottom-0
                        left-0
                        right-0
                        h-0.5
                        bg-indigo-500
                        rounded-t-full
                      "
                    />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* CONTENT */}
          <div className="flex-1 min-h-0 overflow-hidden">

            {/* PREVIEW */}
            {tab === "preview" && canPreview ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
              >
                <iframe
                  sandbox="allow-scripts"
                  title="Artifact Preview"
                  srcDoc={previewDoc}
                  className="
                    block
                    w-full
                    h-full
                    border-0
                    bg-white
                  "
                />
              </motion.div>
            ) : (

              /* EDITOR */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
              >
                <Editor
                  theme="vs-dark"
                  language={detectLanguage(file?.name)}
                  value={file?.content || ""}
                  options={{
                    readOnly: true,
                    minimap: {
                      enabled: false,
                    },
                    fontSize: 13,
                    wordWrap: "on",
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    padding: {
                      top: 16,
                    },
                    lineNumbers: "on",
                    renderLineHighlight: "none",
                  }}
                />
              </motion.div>
            )}

          </div>
        </div>
      ) : (

        /* COLLAPSED */
        <div
          className="
            flex
            flex-col
            items-center
            h-full
            bg-[#0d0f14]
            border-l
            border-white/6
            py-4
            gap-3
            shrink-0
          "
        >
          <button
            className="
              flex
              items-center
              justify-center
              w-7
              h-7
              rounded-lg
              text-slate-500
              hover:text-slate-200
              hover:bg-white/5
              transition-colors
              duration-150
              bg-transparent
              border-none
              cursor-pointer
              shrink-0
            "
            onClick={() => setCollapsed(false)}
          >
            <PanelRightOpen size={16} />
          </button>

          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div
              className="
                text-[10px]
                font-medium
                text-slate-600
                tracking-widest
                uppercase
                whitespace-nowrap
              "
              style={{
                writingMode: "vertical-lr",
                transform: "rotate(180deg)",
              }}
            >
              {artifacts[0]?.title}
            </div>
          </div>
        </div>
      )}
      </>

    )
  }

  return (

    <>
    <button onClick={()=>setIsMobileOpen(true)}  className="lg:hidden fixed 
    right-4
    bottom-24
      bottom-24 z-40 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500  text-white text-[12px] font-medium shadow-lg shadow-indigo-500/20 border-none cursor-pointer">
      <Code2 size={13} />
      View Code
    </button>


  <AnimatePresence>
        { isMobileOpen &&  <> <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1}}
      exit={{opacity:0}}
      transition={{
        duration: 0.25
      }}
      className="
        lg:hidden
        fixed
        inset-0 z-50 bg-black/60 backdrop-blur-sm
      "
  onClick={()=>setIsMobileOpen(false)}  /> 


  <motion.div initial={{x:"100%"}} animate={{x:0}} exit={{x:"100%"}} transition={{duration:0.25,ease:easeInOut}} 
  className="lg:hidden fixed inset-y-0 right-0 z-50 w-[88vw] max-w-[420px] border-1 border-white/6 overflow-hidden">
    <PanelContent/>
  </motion.div>
    </>}
  </AnimatePresence>
    <motion.div
      initial={{ width: 600 }}
      animate={{ width: collapsed ? 48 : 600 }}
      transition={{
        duration: 0.25,
        ease: easeInOut,
      }}
      className="
        hidden
        lg:flex
        h-full
        border
        border-white/6
        flex-col
        overflow-hidden
        shrink-0
      "
    > 
      <PanelContent/>
    </motion.div>
    </>
  )
};

export default Artifact;
