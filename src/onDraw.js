import updateSubjectCount from './util/update-subject-count';

export default function onDraw(){
	updateSubjectCount(this, this.config.id_col, ".annote")
}