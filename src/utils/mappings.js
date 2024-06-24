export const getSchoolById = (schools, id) => {
    return schools.find(school => school.id === id)
}

export const getCourseById = (courses, id) => {
    return courses?.find(course => course.id === id) ?? []
}

