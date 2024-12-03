import React, { useRef, useEffect } from "react";
import { Paper } from "@mantine/core";

interface LiveCodeEditorProps {
  code: string | null | undefined;
}

export const LiveCodeEditor = ({ code }: LiveCodeEditorProps) => {
  const iframeRef = useRef<any>();
  const updateIframeContent = async () => {
    if (!iframeRef.current || !iframeRef.current.contentDocument) return;
    const iframeDoc = iframeRef.current.contentDocument;
    iframeDoc.open();
    if (code === null) {
      iframeDoc.write("");
    } else {
      iframeDoc.write(`
        <html>
          <head>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/react/17.0.2/umd/react.production.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/17.0.2/umd/react-dom.production.min.js"></script>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              body { font-family: Roboto, sans-serif; }
            </style>
            <script>
              window.require = (name) => {
                if (name === 'react') return React
                if (name === 'react-dom') return ReactDOM
                throw new Error('Failed to require ' + JSON.stringify(name))
              }
            </script>
          </head>
          <body>
            <div id="root"></div>
            <script>
              ${code}
              ReactDOM.render(React.createElement(MyApp.default), document.getElementById('root'));
            </script>
          </body>
        </html>
      `);
    }
    iframeDoc.close();
  };

  useEffect(() => {
    updateIframeContent();
  }, [code]);

  return (
    <Paper shadow="xs" p="md" className="w-full h-full">
      <iframe ref={iframeRef} width="100%" height="100%" />
    </Paper>
  );
};
