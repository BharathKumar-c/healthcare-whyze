//debounce method
export const debounce = (func, timedelay) => {
  let timer;
  return function (...args) {
    const context = this;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      func.apply(context, args);
    }, timedelay);
  };
};

//last count return method
let Arr = [];
export const dataReader = (data) => {
  const val = Array.isArray(data);
  if (val) {
    data?.map((element) => {
      Arr.push({ counts: element?.count });
      if (Array.isArray(element?.child)) {
        dataReader(element?.child);
      }
    });
  }
  const lastObj = Arr[Arr.length - 1].counts;
  return lastObj;
};

//validate error for project setting modal
export function validateDataForProjectSetting(data) {
  switch (true) {
    case data.clinicalTrial === '':
      return { clinicalTrial: true };
    case data.sponsor === '':
      return { sponsor: true };
    case data.description === '':
      return { description: true };
    default:
      return null;
  }
}
