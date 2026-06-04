import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'

/* eslint-disable react-hooks/incompatible-library */

export function DataTable({ columns, data, empty, pageSize = 8 }) {
  const [globalFilter, setGlobalFilter] = useState('')
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize })
  const memoColumns = useMemo(() => columns, [columns])
  const memoData = useMemo(() => data, [data])
  const table = useReactTable({
    data: memoData,
    columns: memoColumns,
    state: { globalFilter, pagination },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: false,
  })

  if (!memoData.length) return <div className="empty-state">{empty}</div>

  return (
    <>
      <div className="table-toolbar">
        <input
          aria-label="Search table"
          placeholder="Search..."
          type="search"
          value={globalFilter}
          onChange={(event) => {
            setGlobalFilter(event.target.value)
            table.setPageIndex(0)
          }}
        />
        <span>{table.getFilteredRowModel().rows.length} records</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id}>
                {group.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className={row.original?.isPending ? 'pending-row' : ''}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!table.getRowModel().rows.length ? <div className="empty-state">No matching records</div> : null}
      <TablePagination table={table} />
    </>
  )
}

function TablePagination({ table }) {
  return (
    <div className="table-pagination">
      <span>
        Page {table.getState().pagination.pageIndex + 1} of {Math.max(table.getPageCount(), 1)}
      </span>
      <select
        value={table.getState().pagination.pageSize}
        onChange={(event) => table.setPageSize(Number(event.target.value))}
      >
        {[5, 8, 12, 20].map((size) => <option key={size} value={size}>{size} rows</option>)}
      </select>
      <div className="pagination-actions">
        <button type="button" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Prev
        </button>
        <button type="button" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </button>
      </div>
    </div>
  )
}
