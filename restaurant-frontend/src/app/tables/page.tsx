"use client";

import { useEffect, useState } from "react";
import { gql, useQuery, useSubscription } from "@apollo/client";
import { Tooltip } from "@chakra-ui/tooltip";
import Image from "next/image";
import emptyTable from "/public/empty_table.png";
import waitingTable from "/public/waiting_table.png";
import attendedTable from "/public/attended_table.png";

const GET_TABLES = gql`
  query GetTables {
    tables {
      id
      state
      request {
        description
        price
      }
    }
  }
`;

const TABLE_STATE_SUBSCRIPTION = gql`
  subscription OnTableStateChanged {
    newTableState {
      id
      state
      request {
        description
        price
      }
    }
  }
`;

export default function TablesPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { data: queryData, loading: queryLoading, error: queryError, client } = useQuery(GET_TABLES);
  const { data: subscriptionData } = useSubscription(TABLE_STATE_SUBSCRIPTION, {
    onSubscriptionData: ({ subscriptionData }) => {
      if (subscriptionData.data?.newTableState) {
        updateCacheWithSubscription(subscriptionData.data.newTableState);
      }
    },
  });

  if (!isClient) {
    return <p>Cargando...</p>;
  }

  const updateCacheWithSubscription = (updatedTables) => {
    client.cache.modify({
      fields: {
        tables(existingTables = []) {
          const updatedTableIds = updatedTables.map((table) => table.id);
          const newTables = existingTables.filter(
            (table) => !updatedTableIds.includes(table.__ref.split(":")[1])
          );
          const updatedRefs = updatedTables.map((table) =>
            client.cache.writeFragment({
              data: table,
              fragment: gql`
                fragment NewTableState on Table {
                  id
                  state
                  request {
                    description
                    price
                  }
                }
              `,
            })
          );
          return [...newTables, ...updatedRefs];
        },
      },
    });
  };

  const tables = queryData?.tables || [];

  if (queryLoading) return <p>Cargando...</p>;
  if (queryError) return <p>Error: {queryError.message}</p>;

  const getTableIcon = (state) => {
    switch (state) {
      case "Free":
        return emptyTable;
      case "Waiting":
        return waitingTable;
      case "Attended":
        return attendedTable;
      default:
        return emptyTable;
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Gestión de Mesas</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
        {tables.map((table) => {
          const isOccupied = table.state === "Waiting" || table.state === "Attended";
          const total = table.request?.reduce((acc, item) => acc + item.price, 0) || 0;

          return (
            <Tooltip
              key={table.id}
              label={
                isOccupied ? (
                  <div style={{ padding: "10px", borderRadius: "10px", backgroundColor: "#ffffff", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", color: "#000" }}>
                    <strong>Descripción del pedido:</strong>
                    <ul style={{ margin: "5px 0", paddingLeft: "20px" }}>
                      {table.request?.map((item, index) => (
                        <li key={index} style={{ marginBottom: "5px" }}>
                          {item.description} - ${item.price}
                        </li>
                      ))}
                    </ul>
                    <p style={{ marginTop: "10px", fontWeight: "bold" }}>
                      <strong>Total de la mesa:</strong> ${total}
                    </p>
                  </div>
                ) : (
                  <div style={{ padding: "10px", borderRadius: "10px", backgroundColor: "#ffffff", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", color: "#000" }}>
                    Esta mesa está libre
                  </div>
                )
              }
              aria-label={`Detalles de la mesa ${table.id}`}
              hasArrow
              bg="gray.700"
              color="white"
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "10px",
                  border: "2px solid #ccc",
                  borderRadius: "10px",
                  background: isOccupied ? "#ffe4e1" : "#e0f7fa",
                  cursor: "pointer",
                  width: "120px",
                  height: "150px",
                  textAlign: "center",
                }}
              >
                <Image
                  src={getTableIcon(table.state)}
                  alt={`Ícono de la mesa ${table.id}`}
                  width={50}
                  height={50}
                />
                <p style={{ marginTop: "10px", fontWeight: "bold" }}>Mesa {table.id}</p>
                <p>Estado: {table.state}</p>
              </div>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}
