const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function fetchTrees() {
  const res = await fetch(`${BASE_URL}/api/trees`);
  if (!res.ok) throw new Error("Failed to fetch trees");
  return res.json();
}

export async function createTree(treeData) {
  const res = await fetch(`${BASE_URL}/api/trees`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tree_data: treeData }),
  });
  if (!res.ok) throw new Error("Failed to create tree");
  return res.json();
}

export async function updateTree(id, treeData) {
  const res = await fetch(`${BASE_URL}/api/trees/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tree_data: treeData }),
  });
  if (!res.ok) throw new Error("Failed to update tree");
  return res.json();
}
