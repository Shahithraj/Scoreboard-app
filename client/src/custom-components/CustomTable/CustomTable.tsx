import React, { useMemo, useState } from "react";
import styles from "./CustomTable.module.css";
import CustomInput from "../CustomInput/CustomInput";
import CustomButton from "../CustomButton/CustomButton";

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T, index: number) => React.ReactNode; // ✅ added index param
  sortable?: boolean;
}

interface CustomTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: (item: T) => React.ReactNode;
  searchPlaceholder?: string;
  emptyMessage?: string;
  pageSize?: number;
}
const CustomTable = <T extends object>({
  data,
  columns,
  actions,
  searchPlaceholder = "Search...",
  emptyMessage = "No data available",
  pageSize = 5,
}: CustomTableProps<T>) => {
  // 🔍 Search, ⬆️ Sort, 📄 Pagination state
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);

  // 🔍 Filter by search
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    const lowerQuery = searchQuery.toLowerCase();

    return data.filter((item) =>
      columns.some((col) => {
        const value = item[col.key as keyof T];
        return (
          typeof value === "string" && value.toLowerCase().includes(lowerQuery)
        );
      })
    );
  }, [data, columns, searchQuery]);

  // ⬆️ Sort logic
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey as keyof T];
      const bVal = b[sortKey as keyof T];

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });
  }, [filteredData, sortKey, sortOrder]);

  // 📄 Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

  // 🔁 Sort toggle handler
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* 🔍 Search Input */}
      <div className={styles.tableHeader}>
        <CustomInput
          label=""
          name="search"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  onClick={() =>
                    col.sortable ? handleSort(String(col.key)) : undefined
                  }
                  className={col.sortable ? styles.sortable : ""}
                >
                  {col.label}
                  {col.sortable && sortKey === col.key && (
                    <span className={styles.sortArrow}>
                      {sortOrder === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </th>
              ))}
              {actions && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={String(col.key)}>
                      {col.render
                        ? col.render(item, i) // ✅ pass index
                        : String(item[col.key as keyof T] ?? "")}
                    </td>
                  ))}
                  {actions && <td>{actions(item)}</td>}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)}>
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 📄 Pagination Controls */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <CustomButton
            label="Prev"
            variant="secondary"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          />
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <CustomButton
            label="Next"
            variant="secondary"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          />
        </div>
      )}
    </div>
  );
};

export default CustomTable;
