import React from 'react'

export default function Table({ columns = [], data = [] }){
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded border">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((c, idx)=>(
              <th key={idx} className="text-left px-4 py-2 text-sm text-gray-600">{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rIdx)=> (
            <tr className={rIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} key={rIdx}>
              {columns.map((c, cIdx)=>(
                <td key={cIdx} className="px-4 py-3 text-sm text-gray-700 align-top">{c.render ? c.render(row) : row[c.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
