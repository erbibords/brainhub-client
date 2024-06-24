export const formatSemester = (semester) => {
    if(semester === 'FIRST_SEMESTER') {
        return '1st'
    } else if(semester === 'SECOND_SEMESTER') {
        return '2ND'
    } 
    else if(semester === 'SUMMER') {
        return 'Summer'
    } 
}

export const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
  };