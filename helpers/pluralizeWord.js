const pluralizeWord = (word, len, showNum = true) => {
  if (len === 0) return `${showNum ? len + " " : ""}${word}s`;
  else {
    if (len === 1) return `${showNum ? len + " " : ""}${word}`;
    else return `${showNum ? len + " " : ""}${word}s`;
  }
};

export default pluralizeWord;
