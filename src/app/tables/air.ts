
import data from "./air.json"

export type Row = {
    temperature: number,
    data: number[]
}

export const getAirData = async (): Promise<Row[]> => {
    const copy = JSON.parse(JSON.stringify(data)) as number[][]
    return copy.map((row) => {
        return {
            "temperature": +row[0],
            "data": row.splice(1).map(value => +value)
        }
    })
}