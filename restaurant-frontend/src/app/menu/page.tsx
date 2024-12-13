"use client";

import { gql, useQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import { Input, Button, Box, Heading, VStack, HStack } from "@chakra-ui/react";

// GraphQL Queries and Mutations
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
  const { data, loading, error } = useQuery(GET_MENU);
  const [createCategory] = useMutation(CREATE_CATEGORY, { refetchQueries: [{ query: GET_MENU }] });
  const [updateCategory] = useMutation(UPDATE_CATEGORY, { refetchQueries: [{ query: GET_MENU }] });
  const [deleteCategory] = useMutation(DELETE_CATEGORY, { refetchQueries: [{ query: GET_MENU }] });
  const [createMenuItem] = useMutation(CREATE_ITEM, { refetchQueries: [{ query: GET_MENU }] });
  const [updateMenuItem] = useMutation(UPDATE_ITEM, { refetchQueries: [{ query: GET_MENU }] });
  const [deleteMenuItem] = useMutation(DELETE_ITEM, { refetchQueries: [{ query: GET_MENU }] });

  // State Variables
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");

  const [newItemDescription, setNewItemDescription] = useState("");
  const [newItemPrice, setNewItemPrice] = useState<number | string>("");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingItemDescription, setEditingItemDescription] = useState("");
  const [editingItemPrice, setEditingItemPrice] = useState<number | string>("");

  // Handlers for Categories
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return alert("¡El nombre de la categoría no puede estar vacío!");
    await createCategory({ variables: { name: newCategoryName } });
    setNewCategoryName("");
  };

  const handleEditCategory = async () => {
    if (!editingCategoryId || !editingCategoryName.trim()) return alert("¡El nombre de la categoría no puede estar vacío!");
    await updateCategory({ variables: { id: editingCategoryId, name: editingCategoryName } });
    setEditingCategoryId(null);
    setEditingCategoryName("");
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta categoría?")) {
      await deleteCategory({ variables: { id } });
    }
  };

  // Handlers for Items
  const handleAddItem = async (categoryId: string) => {
    if (!newItemDescription.trim() || isNaN(Number(newItemPrice)) || Number(newItemPrice) <= 0) {
      return alert("¡Por favor, ingresa una descripción y un precio válidos!");
    }
    await createMenuItem({
      variables: { description: newItemDescription, price: Number(newItemPrice), categoryId },
    });
    setNewItemDescription("");
    setNewItemPrice("");
  };

  const handleEditItem = async () => {
    if (!editingItemId || !editingItemDescription.trim() || isNaN(Number(editingItemPrice)) || Number(editingItemPrice) <= 0) {
      return alert("¡Por favor, ingresa una descripción y un precio válidos!");
    }
    await updateMenuItem({
      variables: { id: editingItemId, description: editingItemDescription, price: Number(editingItemPrice) },
    });
    setEditingItemId(null);
    setEditingItemDescription("");
    setEditingItemPrice("");
  };

  const handleDeleteItem = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      await deleteMenuItem({ variables: { id } });
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Box padding="20px">
      <Heading as="h1" size="xl" marginBottom="20px">
        Gestión del Menú
      </Heading>

      {/* Crear nueva categoría */}
      <VStack gap="10px" marginBottom="20px" align="flex-start">
        <Input
          placeholder="Nombre de la nueva categoría"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <Button colorScheme="teal" onClick={handleAddCategory}>
          Añadir Categoría
        </Button>
      </VStack>

      {/* Mostrar categorías y productos */}
      {data.menu.categories.map((category: any) => (
        <Box key={category.id} borderWidth="1px" borderRadius="lg" padding="10px" marginBottom="20px">
          <Heading as="h3" size="md">
            {editingCategoryId === category.id ? (
              <HStack gap="10px">
                <Input
                  value={editingCategoryName}
                  onChange={(e) => setEditingCategoryName(e.target.value)}
                />
                <Button colorScheme="blue" onClick={handleEditCategory}>
                  Guardar
                </Button>
                <Button onClick={() => setEditingCategoryId(null)}>Cancelar</Button>
              </HStack>
            ) : (
              <HStack gap="10px">
                <span>{category.name}</span>
                <Button size="sm" onClick={() => setEditingCategoryId(category.id)}>
                  Editar
                </Button>
                <Button size="sm" colorScheme="red" onClick={() => handleDeleteCategory(category.id)}>
                  Eliminar
                </Button>
              </HStack>
            )}
          </Heading>
          <Box marginY="10px" />

          {/* Productos */}
          <VStack align="stretch">
            {category.items.map((item: any) => (
              <HStack key={item.id} gap="10px">
                {editingItemId === item.id ? (
                  <>
                    <Input
                      value={editingItemDescription}
                      onChange={(e) => setEditingItemDescription(e.target.value)}
                    />
                    <Input
                      type="number"
                      value={editingItemPrice}
                      onChange={(e) => setEditingItemPrice(e.target.value)}
                    />
                    <Button colorScheme="blue" onClick={handleEditItem}>
                      Guardar
                    </Button>
                    <Button onClick={() => setEditingItemId(null)}>Cancelar</Button>
                  </>
                ) : (
                  <>
                    <span>
                      {item.description} - ${item.price}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => {
                        setEditingItemId(item.id);
                        setEditingItemDescription(item.description);
                        setEditingItemPrice(item.price);
                      }}
                    >
                      Editar
                    </Button>
                    <Button size="sm" colorScheme="red" onClick={() => handleDeleteItem(item.id)}>
                      Eliminar
                    </Button>
                  </>
                )}
              </HStack>
            ))}
          </VStack>

          {/* Añadir nuevo producto */}
          <HStack gap="10px" marginTop="10px">
            <Input
              placeholder="Descripción del nuevo producto"
              value={newItemDescription}
              onChange={(e) => setNewItemDescription(e.target.value)}
            />
            <Input
              placeholder="Precio"
              type="number"
              value={newItemPrice}
              onChange={(e) => setNewItemPrice(e.target.value)}
            />
            <Button colorScheme="teal" onClick={() => handleAddItem(category.id)}>
              Añadir Producto
            </Button>
          </HStack>
        </Box>
      ))}
    </Box>
  );
}
