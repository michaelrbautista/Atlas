"use client"

import {
    ColumnDef,
    Row,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import React, { Dispatch, SetStateAction, useState } from "react"
import { Tables } from "../../../../database.types"
import { Reorder } from "framer-motion";
import { useFieldArray, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { udpateOrderOfCollections } from "@/server-actions/collection"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    setData: Dispatch<SetStateAction<TData[]>>
    isReordering: boolean
    setIsReordering: Dispatch<SetStateAction<boolean>>
}

export function ReorderDataTable<TData, TValue>({
    columns,
    data,
    setData,
    isReordering,
    setIsReordering
}: Readonly<DataTableProps<TData, TValue>>) {
    
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel()
    })

    type CollectionsForm = {
        collections: Row<TData>[]
    }

    const form = useForm<CollectionsForm>({
        defaultValues: {
            collections: table.getRowModel().rows
        }
    })

    const { control } = form;
    const { fields, move } = useFieldArray({
        control,
        name: "collections"
    });

    const [active, setActive] = useState(0);

    const saveOrder = async () => {


        const newCollections = fields.map((row, index) => {
            const collection = row.original as Tables<"collections">;
            collection.collection_number = index + 1;
            return collection
        })
        setData(newCollections as TData[]);

        // Update order
        await udpateOrderOfCollections(newCollections);

        setIsReordering(false);
    }

    return (
        <div className="flex flex-col">
            <div className="flex justify-between items-center pb-5">
                <p className="text-foreground text-2xl sm:text-2xl font-bold">Collections</p>
                <div className="flex flex-row gap-5">
                    <Button
                        variant={isReordering ? "disabled" : "secondary"}
                        size="sm"
                        disabled={isReordering}
                        onClick={() => {
                            setIsReordering(false);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant={isReordering ? "disabled" : "systemBlue"}
                        size="sm"
                        disabled={isReordering}
                        onClick={() => {
                            saveOrder();
                            setIsReordering(false);
                        }}
                    >
                        {isReordering && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {!isReordering && "Save"}
                    </Button>
                </div>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    {/* Allow reordering */}
                    {isReordering ? (
                        <Reorder.Group
                            as="tbody"
                            values={fields}
                            onReorder={(e) => {
                                e.forEach((row, index) => {
                                    const activeElement = fields[active];
                                    if (row === activeElement) {
                                        move(active, index);
                                        setActive(index);
                                    }
                                })
                            }}
                        >
                            {table.getRowModel().rows?.length ? (
                                fields.map((row, index) => (
                                    <Reorder.Item
                                        as="tr"
                                        key={row.id}
                                        id={row.id}
                                        value={row}
                                        onDragStart={(e) => {
                                            setActive(index);
                                        }}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </Reorder.Item>
                                ))
                            ): (
                                /* Don't allow reordering */
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </Reorder.Group>
                    ): (
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ): (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    )}
                </Table>
            </div>
        </div>
    )
}
