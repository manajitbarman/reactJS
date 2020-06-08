
/**
 * @param {*} data
 * @param {string} [prefix]
 * @param {FormData} formData
 * @returns {FormData}
 */
export function toFormData(data, prefix = '', formData = new FormData()) {
    if (typeof data === 'object' && !(data instanceof File)) {
      if (Array.isArray(data)) {
        data.map((item, i) => toFormData(item, `${prefix}[${i}]`, formData));
      } else if (data) {
        Object.keys(data).map(key => toFormData(data[key], prefix ? `${prefix}[${key}]` : key, formData));
      }
    } else if (prefix) {
      formData.append(prefix, data);
    }
    return formData;
  }
  
  
  /**
   * @param {*} data - any data that should be uri encoded
   * @returns {string} - query string
   */
  export function uriEncode(data) {
    if (data === null || data === void 0 || (data instanceof Array && !data.length)) {
      return '';
    }
    if (data instanceof Array) {
      return encodeURI(data);
    }
    if (typeof data === 'object') {
      const KEYS = Object.keys(data);
  
      return KEYS
        .map(key => {
          const STR = uriEncode(data[key]);
  
          if (STR) {
            return `${key}=${STR}`;
          }
          return null;
        })
        .filter(val => val !== null)
        .join('&');
    }
    return encodeURI(data);
  }