// Table.jsx

export function Table({ children }) {
    return (
        <table className="w-full border-collapse border border-gray-300 text-sm">
            {children}
        </table>
    );
}

// Header section (the <thead>)
export function TableHeader({ children }) {
    return <thead className="bg-gray-100">{children}</thead>;
}

// Header cell (<th>)
export function TableHead({ children, className = "" }) {
    return (
        <th
            className={`border border-gray-300 px-4 py-2 text-left font-semibold whitespace-nowrap align-middle ${className}`}
        >
            {children}
        </th>
    );
}

// Body section (<tbody>)
export function TableBody({ children }) {
    return <tbody>{children}</tbody>;
}

// Row (<tr>)
export function TableRow({ children }) {
    return <tr className="border-b border-gray-300">{children}</tr>;
}

// Data cell (<td>)
export function TableCell({ children, className = "" }) {
    return (
        <td className={`border border-gray-300 px-4 py-2 align-middle ${className}`}>
            {children}
        </td>
    );
}
