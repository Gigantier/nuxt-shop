export default function (context) {
  // Remove slug from param
  if (context.params.id) {
    const param = context.params.id.split('-');
    if (!isNaN(param[0])) {
      context.params.id = parseInt(param[0]);
    }
  }
};
