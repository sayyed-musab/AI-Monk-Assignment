import { useState, useEffect } from "react";
import TagView from "./components/TagView";
import { fetchTrees, createTree, updateTree } from "./api";

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

function extractClean(node) {
  const clean = { name: node.name };
  if (node.children) {
    clean.children = node.children.map(extractClean);
  } else {
    clean.data = node.data ?? "";
  }
  return clean;
}

export default function App() {
  const [trees, setTrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exportedMap, setExportedMap] = useState({});

  useEffect(() => {
    fetchTrees()
      .then((data) => {
        if (data.length === 0) {
          // No saved trees, load the default initial tree
          setTrees([{ id: null, tree_data: deepClone(initialTree) }]);
        } else {
          setTrees(data);
        }
      })
      .catch((err) => {
        console.error(err);
        setTrees([{ id: null, tree_data: deepClone(initialTree) }]);
      })
      .finally(() => setLoading(false));
  }, []);

  function handleUpdate(index, updated) {
    setTrees((prev) => {
      const newTrees = [...prev];
      newTrees[index] = { ...newTrees[index], tree_data: updated };
      return newTrees;
    });
  }

  async function handleExport(index) {
    const treeEntry = trees[index];
    const clean = extractClean(treeEntry.tree_data);

    setExportedMap((prev) => ({
      ...prev,
      [index]: JSON.stringify(clean, null, 2),
    }));

    try {
      if (treeEntry.id) {
        await updateTree(treeEntry.id, clean);
      } else {
        const saved = await createTree(clean);
        setTrees((prev) => {
          const newTrees = [...prev];
          newTrees[index] = { ...newTrees[index], id: saved.id };
          return newTrees;
        });
      }
    } catch (err) {
      console.error("Export/save failed:", err);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading trees...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Nested Tags Tree
      </h1>
      {trees.map((treeEntry, index) => (
        <div key={treeEntry.id ?? index} className="mb-10">
          <div className="bg-white rounded-xl shadow-md p-6">
            <TagView
              node={treeEntry.tree_data}
              onUpdate={(updated) => handleUpdate(index, updated)}
            />
          </div>
          <button
            onClick={() => handleExport(index)}
            className="mt-4 px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded shadow cursor-pointer transition"
          >
            Export
          </button>
          {exportedMap[index] && (
            <pre className="mt-4 bg-gray-800 text-green-400 rounded-xl p-4 text-sm overflow-x-auto whitespace-pre-wrap break-all">
              {exportedMap[index]}
            </pre>
          )}
        </div>
      ))}
    </div>
  );
}
