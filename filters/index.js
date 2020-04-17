
export function hidePhone(tel){
	if(tel){
		var reg=/(\d{3})\d{4}(\d{4})/;
		var tel = tel.replace(reg, "$1****$2")
		return tel
	}else{
		return ""
	}
}