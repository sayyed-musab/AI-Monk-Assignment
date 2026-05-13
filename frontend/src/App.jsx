import { useState } from "react";
import TagView from "./components/TagView";

const initialTree = {
  name: "root",
  children: [
    {
      name: "child1",
      children: [
        { name: "child1-child1", data: "c1-c1 Hello" },
        { name: "child1-child2", data: "c1-c2 JS" },
      ],
    },
    { name: "child2", data: "c2 World" },
  ],
};

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export default function App() {
  const [tree, setTree] = useState(() => deepClone(initialTree));
  const [exported, setExported] = useState("");

  function extractClean(node) {
    const clean = { name: node.name };
    if (node.children) {
      clean.children = node.children.map(extractClean);
    } else {
      clean.data = node.data ?? "";
    }
    return clean;
  }

  function handleExport() {
    const clean = extractClean(tree);
    setExported(JSON.stringify(clean, null, 2));
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="bg-white rounded-xl shadow-md p-6">
        <TagView node={tree} onUpdate={(updated) => setTree(updated)} />
      </div>
      <button
        onClick={handleExport}
        className="mt-6 px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded shadow cursor-pointer transition"
      >
        Export
      </button>
      {exported && (
        <pre className="mt-4 bg-gray-800 text-green-400 rounded-xl p-4 text-sm overflow-x-auto whitespace-pre-wrap break-all">
          {exported}
        </pre>
      )}
    </div>
  );
}
