import { map, without } from 'lodash';
import { host } from "../api/index";
import emoji from 'react-easy-emoji'

export const generateJID = (id, isMain) => isMain ? 
  `${id}@${host}` : `${id}@${host}/web`;

export function generateProfessionsArray(professions){
  let Services = [];

  professions.forEach((profession)=>{
      let Service = {
        name: profession.professions[0].text,
        categories: profession.professions[1].text.split(',')
      }
      Services.push(Service);
  })
  return Services;
}

export function checkIfLoggedIn(){
  return /(^|;)\s*USER_AUTH=/.test(document.cookie);
}

export function convertDate(date = '') {
	let oldDate = new Date(date.split('.')[0]),
			newDate;
  newDate = (oldDate.getMonth() + 1).toString().padStart(2,'0') 
    + '/' + oldDate.getDate().toString().padStart(2,'0') 
    + '/' + oldDate.getFullYear() 
    + ' ' + oldDate.getHours().toString().padStart(2,'0') 
    + ':' + oldDate.getMinutes().toString().padStart(2,'0');
	return newDate;
}

export function changeDateISOFormat(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2, '0')}`;
}

export function convertDuration(totalSeconds){
	let minutes = parseInt(totalSeconds / 60),
			seconds = totalSeconds - (minutes * 60);

	if (minutes.toString().length == 1) minutes = '0' + minutes;
	if (seconds.toString().length == 1) seconds = '0' + seconds;
	return minutes + ':' + seconds;

}

export function setEmphasizedText(content, elClass) {
  let emphasizedPosition = content.title.indexOf(content.emphasized),
    emphasizedLen = content.emphasized.length;

  return (emphasizedPosition + 1) ?
    <h1 class={elClass}>
      {emoji(content.title.substring(0,emphasizedPosition))}
      <span>{emoji(content.emphasized)}</span>
      {emoji(content.title.substring(emphasizedPosition + emphasizedLen))}
    </h1>
    : <h1 class={elClass}>{emoji(content.title)}</h1>;
}

export const getCookie = (name) => {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

export function bytesToSize(bytes) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

export function secToMS(sec = 0){
  const s = sec % 60;
  const m = (sec - s) / 60;
  
  return {m : m.toString().padStart(2, '0'), s : s.toString().padStart(2, '0')};
}
export function getTotalPrice(timeObj, cpm){
  return timeObj.s > 0 ? cpm * timeObj.m + cpm : cpm * timeObj.m;

}

export function getIntervalStep(val){
  return val <= 1 
    ? 0.01 : val <= 2 
      ? 0.05 : val <= 5 
        ? 0.1 : 0.2;
}