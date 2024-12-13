"use client";

import { gql, useQuery, useMutation } from "@apollo/client";
import { useState } from "react";


const GET_MENU = gql`
  query GetMenu {
    menu {
      categories {
        id
        name
        items {
          id
          description
          price
        }
      }
    }
  }
`;

const CREATE_CATEGORY = gql`
  mutation CreateCategory($name: String!) {
    createCategory(input: { name: $name }) {
      id
      name
    }
  }
`;

const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: String!, $name: String!) {
    updateCategory(id: $id, input: { name: $name }) {
      id
      name
    }
  }
`;

const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: String!) {
    deleteCategory(id: $id) {
      id
    }
  }
`;

const CREATE_ITEM = gql`
  mutation CreateMenuItem($description: String!, $price: Int!, $categoryId: String!) {
    createMenuItem(input: { description: $description, price: $price, categoryId: $categoryId }) {
      id
      description
      price
    }
  }
`;

const UPDATE_ITEM = gql`
  mutation UpdateMenuItem($id: String!, $description: String!, $price: Int!) {
    updateMenuItem(id: $id, input: { description: $description, price: $price }) {
      id
      description
      price
    }
  }
`;

const DELETE_ITEM = gql`
  mutation DeleteMenuItem($id: String!) {
    deleteMenuItem(id: $id) {
      id
    }
  }
`;

export default function MenuPage() {
  const { data, loading, error, refetch } = useQuery(GET_MENU);
  const [createCategory] = useMutation(CREATE_CATEGORY);
  const [updateCategory] = useMutation(UPDATE_CATEGORY);
  const [deleteCategory] = useMutation(DELETE_CATEGORY);
  const [createMenuItem] = useMutation(CREATE_ITEM);
  const [updateMenuItem] = useMutation(UPDATE_ITEM);
  const [deleteMenuItem] = useMutation(DELETE_ITEM);

 
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");

  const [newItemDescription, setNewItemDescription] = useState("");
  const [newItemPrice, setNewItemPrice] = useState<number | string>("");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingItemDescription, setEditingItemDescription] = useState("");
  const [editingItemPrice, setEditingItemPrice] = useState<number | string>("");

  // Handlers para categorías
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    await createCategory({ variables: { name: newCategoryName }, refetchQueries: [{ query: GET_MENU }] });
    setNewCategoryName("");
  };

  const handleEditCategory = async () => {
    if (!editingCategoryId || !editingCategoryName.trim()) return;
    await updateCategory({ variables: { id: editingCategoryId, name: editingCategoryName }, refetchQueries: [{ query: GET_MENU }] });
    setEditingCategoryId(null);
    setEditingCategoryName("");
  };

  const handleDeleteCategory = async (id: string) => {
    await deleteCategory({ variables: { id }, refetchQueries: [{ query: GET_MENU }] });
  };

  // Handlers para productos
  const handleAddItem = async (categoryId: string) => {
    if (!newItemDescription.trim() || !newItemPrice) return;
    await createMenuItem({
      variables: { description: newItemDescription, price: Number(newItemPrice), categoryId },
      refetchQueries: [{ query: GET_MENU }],
    });
    setNewItemDescription("");
    setNewItemPrice("");
  };

  const handleEditItem = async () => {
    if (!editingItemId || !editingItemDescription.trim() || !editingItemPrice) return;
    await updateMenuItem({
      variables: { id: editingItemId, description: editingItemDescription, price: Number(editingItemPrice) },
      refetchQueries: [{ query: GET_MENU }],
    });
    setEditingItemId(null);
    setEditingItemDescription("");
    setEditingItemPrice("");
  };

  const handleDeleteItem = async (id: string) => {
    await deleteMenuItem({ variables: { id }, refetchQueries: [{ query: GET_MENU }] });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Menu Management</h1>

      {/* Crear nueva categoría */}
      <div>
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="New category name"
        />
        <button onClick={handleAddCategory}>Add Category</button>
      </div>

      {/* Mostrar categorías y productos */}
      {data.menu.categories.map((category: any) => (
        <div key={category.id} style={{ margin: "20px 0", border: "1px solid #ccc", padding: "10px" }}>
          <h3>
            {editingCategoryId === category.id ? (
              <>
                <input
                  type="text"
                  value={editingCategoryName}
                  onChange={(e) => setEditingCategoryName(e.target.value)}
                />
                <button onClick={handleEditCategory}>Save</button>
                <button onClick={() => setEditingCategoryId(null)}>Cancel</button>
              </>
            ) : (
              <>
                {category.name}
                <button onClick={() => { setEditingCategoryId(category.id); setEditingCategoryName(category.name); }}>Edit</button>
                <button onClick={() => handleDeleteCategory(category.id)}>Delete</button>
              </>
            )}
          </h3>

          {/* Productos */}
          <ul>
            {category.items.map((item: any) => (
              <li key={item.id}>
                {editingItemId === item.id ? (
                  <>
                    <input
                      type="text"
                      value={editingItemDescription}
                      onChange={(e) => setEditingItemDescription(e.target.value)}
                    />
                    <input
                      type="number"
                      value={editingItemPrice}
                      onChange={(e) => setEditingItemPrice(e.target.value)}
                    />
                    <button onClick={handleEditItem}>Save</button>
                    <button onClick={() => setEditingItemId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    {item.description} - ${item.price}
                    <button onClick={() => { setEditingItemId(item.id); setEditingItemDescription(item.description); setEditingItemPrice(item.price); }}>Edit</button>
                    <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
                  </>
                )}
              </li>
            ))}
          </ul>

          {/* Añadir nuevo producto */}
          <div>
            <input
              type="text"
              value={newItemDescription}
              onChange={(e) => setNewItemDescription(e.target.value)}
              placeholder="New item description"
            />
            <input
              type="number"
              value={newItemPrice}
              onChange={(e) => setNewItemPrice(e.target.value)}
              placeholder="Price"
            />
            <button onClick={() => handleAddItem(category.id)}>Add Item</button>
          </div>
        </div>
      ))}
    </div>
  );
}
