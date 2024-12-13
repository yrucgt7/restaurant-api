"use client";

import { useEffect, useState } from "react";
import { gql, useQuery, useSubscription } from "@apollo/client";
import { Tooltip } from "@chakra-ui/react";

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

  
  const { data: queryData, loading: queryLoading, error: queryError } = useQuery(GET_TABLES);
  const { data: subscriptionData } = useSubscription(TABLE_STATE_SUBSCRIPTION);
  
  if (!isClient) {
    return <p>Loading...</p>;
  }
  const tables = subscriptionData?.newTableState || queryData?.tables || [];

  if (queryLoading) return <p>Loading...</p>;
  if (queryError) return <p>Error: {queryError.message}</p>;

  return (
    <div>
      <h1>Table Management</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {tables.map((table: any) => {
          const isOccupied = table.state === "Waiting" || table.state === "Attended";
          const total = table.request?.reduce((acc: number, item: any) => acc + item.price, 0) || 0;

          return (
            <Tooltip
              key={table.id}
              label={
                isOccupied ? (
                  <div>
                    <strong>Orders:</strong>
                    <ul>
                      {table.request?.map((item: any, index: number) => (
                        <li key={index}>
                          {item.description} - ${item.price}
                        </li>
                      ))}
                    </ul>
                    <p>
                      <strong>Total:</strong> ${total}
                    </p>
                  </div>
                ) : (
                  "This table is empty"
                )
              }
              aria-label={`Table ${table.id} Details`}
              hasArrow
              bg="gray.700"
              color="white"
            >
              <div
                style={{
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  background: isOccupied ? "#f4f4f4" : "#e2e2e2",
                  cursor: "pointer",
                }}
              >
                <strong>Table {table.id}</strong>
                <p>State: {table.state}</p>
              </div>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}
