const UserModel = require('./user');
const GigModel = require('./gig');
const CommentModel = require('./comment')

UserModel.hasMany(GigModel);
UserModel.hasMany(CommentModel);

GigModel.belongsTo(UserModel);
GigModel.hasMany(CommentModel);

CommentModel.belongsTo(GigModel);

module.exports = {UserModel, GigModel, CommentModel}