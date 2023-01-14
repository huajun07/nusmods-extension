interface Classes {
    lessonType: string
    classNo: string

}

interface ClassSlot extends Classes {
    moduleCode: string
}

const semesters = ['sem-1', 'sem-2', 'st-i', 'st-ii']

export const generateUrl = (sessions: ClassSlot[], semester: number): string =>{
    let url = `https://nusmods.com/timetable/${semesters[semester]}/share?`
    const modules: string[] = []
    const classes: Classes[][] = []
    for(const session of sessions){
        const idx = modules.indexOf(session.moduleCode)
        if(idx == -1){
            modules.push(session.moduleCode)
            classes.push([{classNo: session.classNo, lessonType: session.lessonType}])
        }else{
            classes[idx].push({
                classNo: session.classNo, lessonType: session.lessonType
            })
        }
    }
    for(let i = 0; i < modules.length; i++){
        const modClasses = classes[i]
        let modStr = modules[i] + '='
        for(let j = 0; j < modClasses.length; j++){
            if(j>0) modStr += ','
            modStr += `${modClasses[j].lessonType}:${modClasses[j].classNo}`
        }
        if(i > 0)url += '&'
        url += modStr
    }
    return url
}