export const formatSemester = (semester) => {
    if(semester === 'FIRST_SEMESTER') {
        return '1ST'
    } else if(semester === 'SECOND_SEMESTER') {
        return '2ND'
    } 
}


export const formatTakerType = (takerType) => {
  if(takerType === 'FIRST_TAKER') {
      return '1st Taker'
  } else if(takerType === 'RE_TAKER') {
      return 'Re-taker'
  } 
}


export const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
  };

 export const cleanParams = (obj) => {
    Object.keys(obj).forEach((key) => {
      if (obj[key] === undefined || obj[key] === "") {
        delete obj[key];
      }
    });
    return obj;
  }


  