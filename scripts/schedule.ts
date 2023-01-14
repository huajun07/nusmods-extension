import { ModuleLesson } from "./utils";

const taken: boolean[] = []
const blocked: boolean[] = []

type ClassSlot = {
    moduleCode: string
    lessonType: string
    classNo: string
}

var classes: ModuleLesson[] = []

classes.sort((a, b) => a.timings.size - b.timings.size)

const possibleSchedules: ClassSlot[][] = []

export const schedule = (idx: number) => {
    const moduleCode: string = classes[idx].moduleCode
    const tempStr: string = classes[idx].lessonType
    let lessonType: string = ""
    for (let i = 0; i < 3; i++) {
        lessonType += tempStr.charAt(i)
    }
    const timings: Map<string, number[]> = classes[idx].timings
    
}