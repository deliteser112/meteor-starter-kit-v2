import Comments from './Comments';

export default {
  comments: async (parent, args) => {
    return Comments.find(
      { documentId: parent && parent._id },
      { sort: { createdAt: args.sortBy === 'newestFirst' ? -1 : 1 } },
    ).fetch();
  },
};
