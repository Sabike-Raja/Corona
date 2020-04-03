const months: any = {
  '01': 'Jan',
  '02': 'Feb',
  '03': 'Mar',
  '04': 'Apr',
  '05': 'May',
  '06': 'Jun',
  '07': 'Jul',
  '08': 'Aug',
  '09': 'Sept',
  '10': 'Oct',
  '11': 'Nov',
  '12': 'Dec'
};

export const formatDate = (unformattedDate: string) => {
  const day = unformattedDate.slice(0, 2);
  const month = unformattedDate.slice(3, 5);
  const year = unformattedDate.slice(6, 10);
  const time = unformattedDate.slice(11);
  return `${year}-${month}-${day}T${time}+05:30`;
};

export const formatDateAbsolute = (unformattedDate: string) => {
  const day = unformattedDate.slice(0, 2);
  const month = unformattedDate.slice(3, 5);
  const time = unformattedDate.slice(11);
  return `${day} ${months[month]}, ${time.slice(0, 5)} IST`;
};

export const updateBrowserIcon = () => {
  const link: any = document.querySelector("link[rel*='icon']") || document.createElement('link');
  link.type = 'image/png';
  link.rel = 'shortcut icon';
  link.href = 'https://img.favpng.com/5/0/4/wavefront-obj-file-3d-modeling-3d-computer-graphics-virus-chickenpox-png-favpng-XPv3dY9wDsWRzmevjx7uRU9aG.jpg';
  document.getElementsByTagName('head')[0].appendChild(link);
}

export const findGrowthFactor = (array: number[]) => {
  let value = 0, count = 0
  for (let i = array.length - 1; i >= 0; i--) {
    if (count === 10) {
      break;
    }
    value += array[i-1] / array[i-2]
    count ++
  }
  return value/count
}

export const findNextDayValue = (count: number, growthFactor: number, power: number) => {
  return Math.round(count*Math.pow(growthFactor, power))
}

export const findNextDate = (date: string) => {
  const arrayData = date.split(" ")
  const day = parseInt(arrayData[0]) + 1
  return `${day} ${arrayData[1].trim()} 2020`
}
