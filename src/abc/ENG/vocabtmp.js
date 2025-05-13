const wordExp=``;

wordExp.split('\n').forEach(zz=>{
	const key=zz.split('##')[0];
	const exp=zz.split('##')[1];
	// console.log(`('${key.trim()}', '${exp.trim()}'),`);
	console.log(`['${key.trim()}', '${exp.trim()}'],`);
});
