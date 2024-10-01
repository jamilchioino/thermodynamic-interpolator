import air from "./air.json"
import water from "./water.json"

export type Entry = number | null

export type Row = {
  temperature: number
  data: Entry[]
}

export type TableType = "air" | "water"

export type TableData = {
  titles: string[]
  data: string[][]
}

const tables = {
  air,
  water,
}

export const getThermodynamicTable = async (
  tableType: TableType,
): Promise<{ titles: string[]; rows: Row[] }> => {
  const copy = JSON.parse(JSON.stringify(tables[tableType])) as TableData
  return {
    titles: copy.titles,
    rows: copy.data.map((row) => {
      return {
        temperature: +row[0],
        data: row.splice(1).map((value) => (value === "NA" ? null : +value)),
      }
    }),
  }
}
