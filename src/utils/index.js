import { map, without } from 'lodash';
import emoji from 'react-easy-emoji'

export function processActivities(activities){
  let collapsedActivities = [],
      currentActivity = {
        contact:{}
      };

  activities.forEach((activity, index)=>{
    if (activity.contact.id != currentActivity.contact.id) {
      if (index != 0 ) collapsedActivities.push(currentActivity);
      currentActivity = activity;
    } else {
      if (typeof currentActivity.related == 'undefined')  {
        currentActivity.related = [ activity ]
      } else {
        currentActivity.related.push(activity);
      }
    }
  });

  let withoutShortlist = map(collapsedActivities, (entry) => {
    if (entry.status != 'SHORTLIST') return entry;
  });

  withoutShortlist = without(withoutShortlist, undefined);
  return withoutShortlist;
}


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

export function convertDate(date) {
	let oldDate = new Date(date.split('.')[0]),
			newDate;
	newDate = (oldDate.getMonth() + 1) + '/' + oldDate.getDate() + '/' +  oldDate.getFullYear() + ' ' + oldDate.getHours() + ':' + oldDate.getMinutes();
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