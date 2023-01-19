const pluralizeWord = (word, len) => {
  if (len === 0) return `${len} ${word}s`;
  else {
    if (len === 1) return `${len} ${word}`;
    else return `${len} ${word}s`;
  }
};

export default pluralizeWord;
