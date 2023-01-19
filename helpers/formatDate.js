const formatDate = (dateFormat) => {
  const date = new Date(dateFormat?.seconds * 1000);
  return date.toLocaleDateString("en-US");
};

export default formatDate;
