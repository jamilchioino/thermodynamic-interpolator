import { Row } from "@/app/tables/thermodynamics"

export const find = (measurments: Row[], target: number): Row[] | undefined => {
    if (measurments.length === 0) {
        return
    }

    let high = Math.floor(measurments.length - 1)
    let low = 0
    let mid = 0

    while (low <= high) {
        mid = Math.floor((high + low) / 2)

        if (measurments[mid].temperature === target) {
            break
        }

        if (measurments[mid].temperature > target) {
            high = mid - 1
            continue
        }
        if (measurments[mid].temperature < target) {
            low = mid + 1
            continue
        }
    }
    if (measurments[mid].temperature === target) {
        return [measurments[mid]]
    }
    if (measurments[high] === undefined) {
        return [measurments[low]]
    }

    if (measurments[low] === undefined) {
        return [measurments[high]]
    }

    return [measurments[high], measurments[low]]
}