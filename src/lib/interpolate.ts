import { Entry, Row } from "@/app/tables/thermodynamics"

export const interpolate = (
  low: Row,
  high: Row,
  value: number,
): Row | undefined => {
  if (value > high.temperature || value < low.temperature) {
    return
  }

  const x = value
  const x1 = low.temperature
  const x2 = high.temperature

  const interpolatedValues: Entry[] = []

  for (let index = 0; index < low.data.length; index++) {
    const y1 = low.data[index]
    const y2 = high.data[index]

    if (!y1 || !y2) {
      interpolatedValues.push(null)
      continue
    }
    interpolatedValues.push(y1 + ((x - x1) / (x2 - x1)) * (y2 - y1))
  }

  return {
    temperature: value,
    data: interpolatedValues,
  }
}
