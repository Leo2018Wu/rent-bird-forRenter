const utils = {
  // 手机号格式是否正确
  isMobilePhone(value) {
    const reg = /^1[3456789]\d{9}$/
    if (reg.test(value)) {
      return true
    }
    return false
  },
  isIdNumber(value){
	  var reg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
	  if (reg.test(value)) {
	    return true
	  }
	  return false
  }
}


export default utils
