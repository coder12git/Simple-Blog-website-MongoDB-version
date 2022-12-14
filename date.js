// Own export module for getting date
exports.getDate = function getDate(){
  const today = new Date();
  const options = {
    weekday : "long",
    day : "numeric",
    month : "long",
    year : "numeric"
  };
  return today.toLocaleDateString("en-US",options);

};

exports.getDay = function getDay(){
  const today = new Date();
  const options = {
    weekday : "long"
  };
  return today.toLocaleDateString("en-US",options);
};
