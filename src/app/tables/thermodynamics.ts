
import air from "./air.json"
import water from "./water.json"


export type Row = {
    temperature: number,
    data: number[]
}

export type TableType = "air" | "water"

const tables = {
    air,
    water,
}

export const getThermodynamicTable = async (tableType: TableType): Promise<Row[]> => {
    const copy = JSON.parse(JSON.stringify(tables[tableType])) as number[][]
    return copy.map((row) => {
        return {
            "temperature": +row[0],
            "data": row.splice(1).map(value => +value)
        }
    })
}