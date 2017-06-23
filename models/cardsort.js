var mongoose = require('mongoose');  

var CardSortStudy = new mongoose.Schema({
	title: String,
	type: String,
	studyType: { type: String,
				enum: ['open', 'closed'],
			},
	cards: [],
	groups: [],
	responses: [{
		participantID: String,
		groups: [{
			cards: []
		}]
	}]
});

module.exports = mongoose.model('CardSortStudy', CardSortStudy);

