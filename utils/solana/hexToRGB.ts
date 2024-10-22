/**
 * Returns a color from a hex string and alpha numeric
 * @param   {String} hex   a hex string
 * @param   {Number} alpha an alpha numeric
 * @returns {String}       a formatted rgba
 */
const hexToRGB = (hex: string, alpha: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
  
    return `rgba(${r},${g},${b},${alpha})`;
  };
  
  export default hexToRGB;