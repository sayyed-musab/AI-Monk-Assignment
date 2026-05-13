import { useState } from "react";

function generateId() {
  return Math.random().toString(36).slice(2);
}

function buildNode(name, data) {
  return { _id: generateId(), name, data };
}

function ensureIds(node) {
  if (!node._id) node._id = generateId();
  if (node.children) node.children.forEach(ensureIds);
  return node;
}

export default function TagView({ node: rawNode, onUpdate }) {
  const node = ensureIds(rawNode);
  const [collapsed, setCollapsed] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(node.name);

  function handleAddChild() {
    const newChild = buildNode("New Child", "Data");
    const updated = { ...node };
    if (updated.children) {
      updated.children = [...updated.children, newChild];
    } else {
      delete updated.data;
      updated.children = [newChild];
    }
    onUpdate(updated);
  }

  function handleDataChange(e) {
    onUpdate({ ...node, data: e.target.value });
  }

  function handleChildUpdate(index, updatedChild) {
    const newChildren = [...node.children];
    newChildren[index] = updatedChild;
    onUpdate({ ...node, children: newChildren });
  }

  function handleNameKeyDown(e) {
    if (e.key === "Enter") {
      onUpdate({ ...node, name: tempName });
      setEditingName(false);
    }
  }

  return (
    <div className="border-2 border-blue-400 rounded-lg mb-3 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between bg-blue-400 px-3 py-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded text-sm font-bold text-gray-700 cursor-pointer transition"
          >
            {collapsed ? ">" : "v"}
          </button>
          {editingName ? (
            <input
              autoFocus
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onKeyDown={handleNameKeyDown}
              className="px-2 py-1 rounded text-sm text-gray-800 border border-blue-200 focus:outline-none"
            />
          ) : (
            <span
              onClick={() => {
                setTempName(node.name);
                setEditingName(true);
              }}
              className="font-bold text-white text-sm cursor-pointer hover:underline"
            >
              {node.name}
            </span>
          )}
        </div>
        <button
          onClick={handleAddChild}
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded cursor-pointer transition"
        >
          Add Child
        </button>
      </div>

      {/* Body */}
      {!collapsed && (
        <div className="bg-blue-50 p-3">
          {node.children ? (
            node.children.map((child, i) => (
              <TagView
                key={child._id || i}
                node={child}
                onUpdate={(updated) => handleChildUpdate(i, updated)}
              />
            ))
          ) : (
            <div className="flex items-center gap-3 py-1">
              <label className="text-sm text-gray-600 font-medium">Data</label>
              <input
                value={node.data ?? ""}
                onChange={handleDataChange}
                className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
